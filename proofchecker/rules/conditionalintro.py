from proofchecker.proofs.proofobjects import ProofObj, ProofLineObj, ProofResponse
from proofchecker.proofs.proofutils import clean_rule, get_line_no, get_lines_in_subproof, verify_subproof_citation, make_tree, get_expressions
from .rule import Rule

class ConditionalIntro(Rule):

    name = "Conditional Introduction"
    symbols = "→I"
        
    def verify(self, current_line: ProofLineObj, proof: ProofObj):
        """
        Verify proper implementation of the rule →I m
        (Conditional Introduction)
        Note: m is a subproof citation
        """
        rule = clean_rule(current_line.rule)
        response = ProofResponse()

        # Attempt to find first and last lines of subproof m
        try:
            target_line_no = get_line_no(rule)
            target_lines = get_lines_in_subproof(target_line_no, proof)

            # Verify that subproof citation are valid
            for line in target_lines:
                result = verify_subproof_citation(current_line, line)
                if result.is_valid == False:
                    return result
            
            # Search for lines in the proof
            try:
                expressions = get_expressions(target_lines)

                root_m = make_tree(expressions[0])
                root_n = make_tree(expressions[1])
                root_current = make_tree(current_line.expression)

                if (root_current.left == root_m) and (root_current.right == root_n):
                    response.is_valid = True
                    return response
                else:
                    response.err_msg = "The expressions on lines {} and {} do not match the implication on line {}"\
                        .format(str(target_lines[0].line_no),str(target_lines[1].line_no),str(current_line.line_no))
                    return response

            except:
                response.err_msg = "Line numbers are not specified correctly.  Conditional Introduction: →I m"
                return response

        except:
            response.err_msg = "Rule not formatted properly.  Conditional Introduction: →I m"
            return response
