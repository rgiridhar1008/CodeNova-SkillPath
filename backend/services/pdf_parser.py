import fitz


def extract_text_from_pdf(file_stream) -> str:
    pdf_data = file_stream.read()
    with fitz.open(stream=pdf_data, filetype="pdf") as doc:
        pages = [page.get_text("text") for page in doc]
    return "\n".join(pages).strip()
