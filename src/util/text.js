import { SMILEY_LIKE, SMILEYS } from "smileys";

export function replaceSmileys(text, removeEscapes = true) {
    if (text == null) {
        return text;
    }
    return text.replace(SMILEY_LIKE, (match, p1, p2) => {
        if (p2.startsWith("\\")) {
            return removeEscapes ? p1 + p2.substring(1) : match;
        }
        for (const smiley of SMILEYS) {
            if (smiley.repeatGroup) {
                const m = p2.match(smiley.regex);
                if (m) {
                    const count = m[smiley.repeatGroup] ? m[smiley.repeatGroup].length : 1;
                    return p1 + String.fromCodePoint(smiley.emoji).repeat(count);
                }
            } else {
                if (smiley.regex.test(p2)) {
                    return p1 + String.fromCodePoint(smiley.emoji);
                }
            }
        }
        return match;
    })
}
