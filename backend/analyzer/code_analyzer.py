import ast
import re
from typing import Dict, List, Any

class CodeAnalyzer:
    def analyze(self, code: str, language: str) -> Dict[str, Any]:
        if language == "python":
            return self._analyze_python(code)
        else:
            return self._analyze_generic(code, language)

    def _analyze_python(self, code: str) -> Dict[str, Any]:
        bugs = []
        optimizations = []
        complexity = {"level": "unknown", "score": 0, "details": ""}
        quality_score = 100

        try:
            tree = ast.parse(code)
        except SyntaxError as e:
            return {
                "bugs": [{"severity": "critical", "message": f"Syntax Error: {e.msg}", "line": e.lineno, "type": "SyntaxError"}],
                "optimizations": [],
                "complexity": {"level": "unknown", "score": 0, "details": "Cannot analyze due to syntax error"},
                "quality_score": 0
            }

        # Detect nested loops
        nested_loops = self._find_nested_loops(tree)
        if nested_loops:
            for loc in nested_loops:
                optimizations.append({
                    "type": "performance",
                    "severity": "medium",
                    "message": f"Nested loop detected at line {loc} - O(n²) or worse complexity. Consider using dict/set for lookups.",
                    "line": loc
                })
                quality_score -= 10

        # Detect unused variables
        unused_vars = self._find_unused_variables(tree)
        for var, line in unused_vars:
            bugs.append({
                "severity": "low",
                "message": f"Variable '{var}' is assigned but never used.",
                "line": line,
                "type": "UnusedVariable"
            })
            quality_score -= 5

        # Detect bare except clauses
        bare_excepts = self._find_bare_excepts(tree)
        for line in bare_excepts:
            bugs.append({
                "severity": "medium",
                "message": "Bare 'except:' clause catches all exceptions including SystemExit. Use 'except Exception:' or specify exception types.",
                "line": line,
                "type": "BareExcept"
            })
            quality_score -= 8

        # Detect mutable default arguments
        mutable_defaults = self._find_mutable_defaults(tree)
        for func_name, line in mutable_defaults:
            bugs.append({
                "severity": "high",
                "message": f"Function '{func_name}' uses mutable default argument. This is a common Python gotcha - default is shared across calls.",
                "line": line,
                "type": "MutableDefault"
            })
            quality_score -= 15

        # Detect global variables
        globals_used = self._find_globals(tree)
        for var, line in globals_used:
            optimizations.append({
                "type": "design",
                "severity": "low",
                "message": f"Global variable '{var}' used at line {line}. Consider passing as parameter for better testability.",
                "line": line
            })
            quality_score -= 3

        # Complexity analysis
        complexity = self._calculate_complexity(tree, code)
        
        # Long functions check
        long_funcs = self._find_long_functions(tree)
        for func_name, length, line in long_funcs:
            optimizations.append({
                "type": "readability",
                "severity": "medium",
                "message": f"Function '{func_name}' at line {line} has {length} lines. Consider breaking it into smaller functions (recommended: < 20 lines).",
                "line": line
            })
            quality_score -= 5

        # Magic numbers
        magic_numbers = self._find_magic_numbers(tree)
        for num, line in magic_numbers[:3]:  # Limit to first 3
            optimizations.append({
                "type": "readability",
                "severity": "low",
                "message": f"Magic number '{num}' at line {line}. Consider extracting to a named constant.",
                "line": line
            })
            quality_score -= 2

        quality_score = max(0, min(100, quality_score))

        return {
            "bugs": bugs,
            "optimizations": optimizations,
            "complexity": complexity,
            "quality_score": quality_score
        }

    def _find_nested_loops(self, tree: ast.AST) -> List[int]:
        locations = []
        
        class NestedLoopVisitor(ast.NodeVisitor):
            def __init__(self):
                self.loop_depth = 0
                
            def visit_For(self, node):
                if self.loop_depth > 0:
                    locations.append(node.lineno)
                self.loop_depth += 1
                self.generic_visit(node)
                self.loop_depth -= 1
                
            def visit_While(self, node):
                if self.loop_depth > 0:
                    locations.append(node.lineno)
                self.loop_depth += 1
                self.generic_visit(node)
                self.loop_depth -= 1
        
        NestedLoopVisitor().visit(tree)
        return locations

    def _find_unused_variables(self, tree: ast.AST) -> List[tuple]:
        assigned = {}
        used = set()
        
        class VarVisitor(ast.NodeVisitor):
            def visit_Assign(self, node):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        assigned[target.id] = target.lineno
                self.generic_visit(node)
            
            def visit_Name(self, node):
                if isinstance(node.ctx, ast.Load):
                    used.add(node.id)
                self.generic_visit(node)
        
        VarVisitor().visit(tree)
        
        unused = []
        for var, line in assigned.items():
            if var not in used and not var.startswith('_'):
                unused.append((var, line))
        return unused

    def _find_bare_excepts(self, tree: ast.AST) -> List[int]:
        locations = []
        for node in ast.walk(tree):
            if isinstance(node, ast.ExceptHandler) and node.type is None:
                locations.append(node.lineno)
        return locations

    def _find_mutable_defaults(self, tree: ast.AST) -> List[tuple]:
        results = []
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                for default in node.args.defaults:
                    if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                        results.append((node.name, node.lineno))
                        break
        return results

    def _find_globals(self, tree: ast.AST) -> List[tuple]:
        results = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Global):
                for name in node.names:
                    results.append((name, node.lineno))
        return results

    def _find_long_functions(self, tree: ast.AST) -> List[tuple]:
        results = []
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                if hasattr(node, 'end_lineno') and node.end_lineno:
                    length = node.end_lineno - node.lineno
                    if length > 30:
                        results.append((node.name, length, node.lineno))
        return results

    def _find_magic_numbers(self, tree: ast.AST) -> List[tuple]:
        results = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
                if node.value not in (0, 1, -1, 2, True, False):
                    results.append((node.value, node.lineno))
        return results

    def _calculate_complexity(self, tree: ast.AST, code: str) -> Dict:
        # Count cyclomatic complexity indicators
        complexity_score = 1
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.While, ast.For, ast.ExceptHandler,
                                  ast.With, ast.Assert, ast.comprehension)):
                complexity_score += 1
            elif isinstance(node, ast.BoolOp):
                complexity_score += len(node.values) - 1

        lines = len(code.strip().split('\n'))
        
        if complexity_score <= 5:
            level = "Low"
            notation = "O(n)"
            description = "Simple linear logic. Easy to maintain and test."
        elif complexity_score <= 10:
            level = "Medium"
            notation = "O(n log n)"
            description = "Moderate branching. Still manageable with good documentation."
        elif complexity_score <= 20:
            level = "High"
            notation = "O(n²)"
            description = "Complex logic with many branches. Consider refactoring into smaller functions."
        else:
            level = "Very High"
            notation = "O(n³) or worse"
            description = "Extremely complex. High risk of bugs. Refactoring strongly recommended."

        return {
            "level": level,
            "score": min(complexity_score, 100),
            "cyclomatic": complexity_score,
            "notation": notation,
            "lines": lines,
            "details": description
        }

    def _analyze_generic(self, code: str, language: str) -> Dict[str, Any]:
        lines = code.strip().split('\n')
        bugs = []
        optimizations = []
        
        # Generic checks for any language
        for i, line in enumerate(lines, 1):
            # Very long lines
            if len(line) > 120:
                optimizations.append({
                    "type": "readability",
                    "severity": "low",
                    "message": f"Line {i} is {len(line)} characters long. Consider breaking it up (recommended: < 120).",
                    "line": i
                })
        
        # TODO comments
        todos = [(i+1, line.strip()) for i, line in enumerate(lines) if 'TODO' in line or 'FIXME' in line or 'HACK' in line]
        for line_no, todo in todos[:5]:
            bugs.append({
                "severity": "low",
                "message": f"Found '{todo}' at line {line_no}. Make sure to address this before production.",
                "line": line_no,
                "type": "TODO"
            })

        return {
            "bugs": bugs,
            "optimizations": optimizations,
            "complexity": {"level": "Unknown", "score": 50, "details": f"Static analysis for {language} not fully supported yet.", "notation": "N/A", "lines": len(lines)},
            "quality_score": 70
        }
