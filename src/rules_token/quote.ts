import { ITokenizer, TokenRule } from "../types/token"
const re1 = /^\[qt\]\[qtmeta aid=(\d+) time=(\d+)\]/
const re2 = /^\[引用 aid=(\d+) time=(\d+)\]/
export const qtOpen: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  const m1: RegExpMatchArray | null = src.slice(t.pos, t.pos + 50).match(re1)
  const m2: RegExpMatchArray | null = src.slice(t.pos, t.pos + 50).match(re2)
  if (!m1 && !m2) {
    return false
  }
  if (silent) {
    return true
  }

  if (m1) {
    let pos = t.pos
    t.tokens.push({
      type: "quote_open",
      value: "",
      position: {
        start: pos,
        end: pos + 11,
      },
    })
    pos += 11
    t.tokens.push({
      type: "text",
      value: m1[1],
      position: {
        start: pos,
        end: pos + 5 + m1[1].length,
      },
    })
    pos += 5 + m1[1].length
    t.tokens.push({
      type: "text",
      value: m1[2],
      position: {
        start: pos,
        end: pos + 7 + m1[2].length,
      },
    })
    t.pos += m1[0].length
    return true
  } else if (m2) {
    let pos = t.pos
    t.tokens.push({
      type: "quote_open",
      value: "",
      position: {
        start: pos,
        end: pos + 3,
      },
    })
    pos += 3
    t.tokens.push({
      type: "text",
      value: m2[1],
      position: {
        start: pos,
        end: pos + 5 + m2[1].length,
      },
    })
    pos += 5 + m2[1].length
    t.tokens.push({
      type: "text",
      value: m2[2],
      position: {
        start: pos,
        end: pos + 7 + m2[2].length,
      },
    })
    t.pos += m2[0].length
    return true
  } else {
    return false
  }
}

export const qtClose: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  if (
    len - t.pos < 5 ||
    (src.slice(t.pos, t.pos + 5) !== "[/qt]" &&
      src.slice(t.pos, t.pos + 5) !== "[/引用]")
  ) {
    return false
  }
  if (silent) {
    return true
  }
  t.tokens.push({
    type: "quote_close",
    value: "",
    position: {
      start: t.pos,
      end: t.pos + 5,
    },
  })
  t.pos += 5
  if (src.charCodeAt(t.pos) === 0x0a) {
    t.pos++
  }
  return true
}
