import GLPK from 'glpk.js';
const mkglpk = (): GLPK.GLPK => (GLPK as () => GLPK.GLPK)();
export const glpk = mkglpk();