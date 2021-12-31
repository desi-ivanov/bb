import type { LP, GLPK } from "glpk.js";
type Var = { coef: number; name: string };
type Constraint = { vars: Var[]; op: "<=" | ">=" | "="; right: number };
type ParsedProblem = {
  objective: { direction: "max" | "min"; vars: Var[] };
  subjectTo: Constraint[];
};

const parseSign = (raw: string): { sign: number; rest: string } => {
  const trimmed = raw.trimStart();
  return trimmed.startsWith("-")
    ? { sign: -1, rest: trimmed.slice(1) }
    : trimmed.startsWith("+")
    ? { sign: 1, rest: trimmed.slice(1) }
    : { sign: 1, rest: trimmed };
};

const parseNumExpr = (raw: string): { value?: number; rest: string } => {
  const trimmed = raw.trimStart();
  const expr = trimmed.match(/^(\+|\-|\*|\/|\d|\(|\))+/)?.[0];
  return {
    value: expr ? eval(expr) : undefined,
    rest: trimmed.slice(expr?.length),
  };
};

const parseCoeff = (raw: string): { coef: number; rest: string } => {
  const trimmed = raw.trimStart();
  const { sign, rest } = parseSign(trimmed);
  const { value, rest: rest2 } = parseNumExpr(rest);
  return { coef: sign * (value ?? 1), rest: rest2 };
};

const parseName = (raw: string): { name?: string; rest: string } => {
  const trimmed = raw.trimStart();
  const matched = trimmed.match(/^[a-zA-Z_]\w*/)?.[0];
  return { name: matched, rest: trimmed.slice(matched?.length) };
};

const parseVar = (raw: string): { var: Var; rest: string } | null => {
  const trimmed = raw.trimStart();
  const { coef, rest } = parseCoeff(trimmed);
  const { name, rest: rest2 } = parseName(rest);
  if (name === undefined) return null;
  return { var: { coef, name }, rest: rest2 };
};

const parseVars = (raw: string): { vars: Var[]; rest: string } => {
  const q = [];
  let v = parseVar(raw);
  let lastV = v;
  do {
    if (v) {
      q.push(v.var);
      lastV = v;
      v = parseVar(v.rest);
    }
  } while (v !== null);
  return { vars: q, rest: lastV === null ? raw : lastV.rest };
};

const parseOp = (raw: string): { op?: "<=" | ">=" | "="; rest: string } => {
  const trimmed = raw.trimStart();
  const op = trimmed.startsWith("<=")
    ? "<="
    : trimmed.startsWith(">=")
    ? ">="
    : trimmed.startsWith("=")
    ? "="
    : undefined;
  return {
    op: op,
    rest: trimmed.slice(op?.length),
  };
};

const parseConstraint = (
  line: string
): { constraint: Constraint; rest: string } => {
  const trimmed = line.trimStart();
  const { vars, rest } = parseVars(trimmed);
  const { op, rest: rest2 } = parseOp(rest);
  if (op === undefined) {
    console.log(vars, rest);
    throw new Error(`Unexpected operator: ${rest}`);
  }
  const { value, rest: rest3 } = parseNumExpr(rest2);
  if (value === undefined) throw new Error(`Unexpected value: ${rest2}`);
  return {
    constraint: { vars, op, right: value },
    rest: rest3,
  };
};

export const parse = (problem: string): ParsedProblem => {
  const [rawObj, ...rawCs] = problem
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const direction = rawObj.startsWith("max") ? "max" : "min";
  const obj = parseVars(rawObj.split("=").reverse()[0]).vars;
  const cs = rawCs.map(parseConstraint);
  return {
    objective: { direction, vars: obj },
    subjectTo: cs.map((c) => c.constraint),
  };
};

export const toGlpk = (
  p: ParsedProblem,
  glpk: GLPK,
  name: string = "problem"
): LP => {
  return {
    name: name,
    objective: {
      direction: p.objective.direction === "max" ? glpk.GLP_MAX : glpk.GLP_MIN,
      name: "obj",
      vars: p.objective.vars,
    },
    subjectTo: p.subjectTo.map((c, i) => ({
      name: `c${i}`,
      vars: c.vars,
      bnds: {
        type:
          c.op === "="
            ? glpk.GLP_DB
            : c.op === "<="
            ? glpk.GLP_UP
            : glpk.GLP_LO,
        ub: c.right,
        lb: c.right,
      },
    })),
  };
};
