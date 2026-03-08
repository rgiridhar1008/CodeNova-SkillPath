from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def build_report_pdf(report_data: dict) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, title="SkillPath Report")
    styles = getSampleStyleSheet()
    story = []

    analysis = report_data.get("analysis", {})
    roadmap = report_data.get("roadmap", {})

    story.append(Paragraph("AI Skill Gap Analyzer Report", styles["Title"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Career Target: {analysis.get('career', 'N/A')}", styles["Heading2"]))
    story.append(
        Paragraph(
            f"Skill Match Percentage: {analysis.get('skillMatchPercentage', 0)}%",
            styles["Normal"],
        )
    )
    story.append(Spacer(1, 10))

    table_data = [
        ["Strength Areas", ", ".join(analysis.get("strengthAreas", [])) or "None"],
        ["Missing Skills", ", ".join(analysis.get("missingSkills", [])) or "None"],
    ]
    table = Table(table_data, colWidths=[120, 380])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#E8EEF9")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#D0DAEE")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D0DAEE")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 12))
    story.append(Paragraph("3-Month Roadmap", styles["Heading2"]))
    story.append(Paragraph(roadmap.get("summary", "No summary available."), styles["Normal"]))
    story.append(Spacer(1, 8))

    for month in roadmap.get("months", []):
        story.append(Paragraph(f"{month.get('month')}: {month.get('focus')}", styles["Heading3"]))
        for week in month.get("weeklyPlan", []):
            story.append(Paragraph(f"- {week}", styles["Normal"]))
        story.append(Spacer(1, 6))

    if roadmap.get("projects"):
        story.append(Paragraph("Project Suggestions", styles["Heading2"]))
        for project in roadmap["projects"]:
            story.append(Paragraph(f"- {project}", styles["Normal"]))

    doc.build(story)
    return buffer.getvalue()
