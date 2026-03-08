import re
from typing import Iterable

try:
    import spacy
    from spacy.matcher import PhraseMatcher
except Exception:  # pragma: no cover
    spacy = None
    PhraseMatcher = None


def _safe_nlp():
    if spacy is None:
        return None
    try:
        return spacy.load("en_core_web_sm")
    except Exception:
        return spacy.blank("en")


NLP = _safe_nlp()


def build_matcher(skill_vocab: Iterable[str]):
    if NLP is None or PhraseMatcher is None:
        return None
    matcher = PhraseMatcher(NLP.vocab, attr="LOWER")
    patterns = [NLP.make_doc(skill) for skill in skill_vocab if skill.strip()]
    if patterns:
        matcher.add("SKILLS", patterns)
    return matcher


def extract_skills(text: str, skill_vocab: Iterable[str]) -> list[str]:
    if not text:
        return []

    matcher = build_matcher(skill_vocab)
    doc = NLP(text) if NLP is not None else None

    found = set()
    if matcher is not None and doc is not None:
        for _, start, end in matcher(doc):
            skill = doc[start:end].text.strip()
            if skill:
                found.add(skill.lower())

    # Regex fallback captures short technical keywords.
    tokens = re.findall(r"[A-Za-z0-9\+\#\.\-]{2,}", text.lower())
    vocab_lower = {skill.lower(): skill for skill in skill_vocab}
    for token in tokens:
        if token in vocab_lower:
            found.add(token)

    return sorted(vocab_lower[s] for s in found if s in vocab_lower)
