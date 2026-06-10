from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "TaskFlow-AI-INT332-Report-Shriya-Verma.pdf"


def styles():
    base = getSampleStyleSheet()
    base.add(
        ParagraphStyle(
            name="TitleCenter",
            parent=base["Title"],
            alignment=TA_CENTER,
            fontSize=22,
            leading=28,
            textColor=colors.HexColor("#1F4D78"),
            spaceAfter=16,
        )
    )
    base.add(
        ParagraphStyle(
            name="SubTitleCenter",
            parent=base["Normal"],
            alignment=TA_CENTER,
            fontSize=14,
            leading=18,
            spaceAfter=10,
        )
    )
    base.add(
        ParagraphStyle(
            name="Section",
            parent=base["Heading1"],
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#2E74B5"),
            spaceBefore=14,
            spaceAfter=8,
        )
    )
    base.add(
        ParagraphStyle(
            name="SubSection",
            parent=base["Heading2"],
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#2E74B5"),
            spaceBefore=10,
            spaceAfter=6,
        )
    )
    base.add(
        ParagraphStyle(
            name="BodyReport",
            parent=base["BodyText"],
            fontSize=10.7,
            leading=14,
            alignment=TA_LEFT,
            spaceAfter=7,
        )
    )
    base.add(
        ParagraphStyle(
            name="BulletReport",
            parent=base["BodyText"],
            fontSize=10.5,
            leading=14,
            leftIndent=18,
            bulletIndent=8,
            spaceAfter=5,
        )
    )
    return base


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#555555"))
    canvas.drawCentredString(4.25 * inch, 0.45 * inch, f"TaskFlow AI Project Report | Page {doc.page}")
    canvas.restoreState()


def p(text, style):
    return Paragraph(text.replace("\n", "<br/>"), style)


def section(story, st, title, body):
    story.append(p(title, st["Section"]))
    for para in body:
        story.append(p(para, st["BodyReport"]))


def bullets(story, st, items):
    for item in items:
        story.append(Paragraph(item, st["BulletReport"], bulletText="•"))


def table(story, rows):
    data = [[Paragraph(f"<b>{a}</b>", styles()["BodyReport"]), Paragraph(b, styles()["BodyReport"])] for a, b in rows]
    t = Table(data, colWidths=[2.0 * inch, 4.1 * inch])
    t.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#B8C2CC")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#E8EEF5")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.append(t)
    story.append(Spacer(1, 10))


def build():
    st = styles()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=LETTER,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=inch,
        bottomMargin=inch,
    )
    story = []

    story.extend([Spacer(1, 70), p("TaskFlow AI", st["TitleCenter"])])
    story.append(
        p(
            "Advanced Todo Management Application<br/>Using React.js and Docker-Based DevOps Workflow",
            st["SubTitleCenter"],
        )
    )
    story.append(Spacer(1, 32))
    story.append(p("<b>Report</b>", st["SubTitleCenter"]))
    for line in [
        "Submitted in partial fulfilment of the requirements for the award of degree of",
        "<b>BTech - Computer Science and Engineering</b>",
        "<b>LOVELY PROFESSIONAL UNIVERSITY</b>",
        "PHAGWARA, PUNJAB",
    ]:
        story.append(p(line, st["SubTitleCenter"]))
    story.append(Spacer(1, 20))
    table(
        story,
        [
            ("Submitted By", "Name of student: Shriya Verma<br/>Registration Number: 12323829<br/>Signature: Shriya Verma"),
            ("Submitted To", "Faculty: Prof. Divya Thakur"),
            ("Course", "INT332 - DevOps"),
            ("Date", "30 May 2026"),
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "Student Declaration",
        [
            "I, Shriya Verma, 12323829, hereby declare that the work done by me on TaskFlow AI: Advanced Todo Management Application Using React.js and Docker-Based DevOps Workflow is a record of original work carried out for the partial fulfilment of the requirements for the award of the degree, BTech - Computer Science and Engineering.",
            "Name of the Student (Registration Number): Shriya Verma (12323829)",
            "Signature of the student: Shriya Verma",
            "Dated: 30 May 2026",
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "1. Acknowledgement",
        [
            "I would like to express my sincere gratitude to Lovely Professional University for providing me with the opportunity to undertake this project as part of my academic curriculum.",
            "I extend my thanks to my faculty guide and the Computer Science and Engineering department for their guidance and support during the development of this project.",
            "I am thankful to the open-source communities behind React.js, Vite, Tailwind CSS, Docker, Node.js, GitHub Actions, and related tools. Their documentation helped in developing and containerizing the application.",
            "Lastly, I thank my classmates, peers, and family members for their encouragement and support throughout the completion of this project.",
            "Shriya Verma<br/>Registration Number: 12323829",
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "2. Abstract",
        [
            "Modern software systems require functional application development as well as reliable deployment workflows. DevOps practices, containerization, and automated verification reduce environment mismatch issues and improve software delivery.",
            "This project demonstrates these concepts through TaskFlow AI, an advanced todo management application built using React.js. The application provides a landing page, login and signup pages, dashboard, task management, task details, calendar view, analytics, settings, dark/light theme, smooth animations, and localStorage persistence.",
            "The frontend uses React Router DOM for navigation, Context API for state management, Tailwind CSS for styling, Framer Motion for animations, Lucide React for icons, and Recharts for data visualization. The application is containerized using Docker and served through Nginx. Docker Compose orchestrates the frontend and backend services, while GitHub Actions verifies the project automatically.",
        ],
    )
    story.append(PageBreak())

    section(story, st, "3. Table of Contents", [])
    for entry in [
        "1. Acknowledgement",
        "2. Abstract",
        "3. Table of Contents",
        "4. List of Abbreviations",
        "5. Introduction",
        "6. Literature Review and Technology Background",
        "7. Objectives of the Project",
        "8. Methodology",
        "9. Requirements and Technology Stack",
        "10. System Design and Architecture",
        "11. Implementation Details",
        "12. Docker and DevOps Workflow",
        "13. Testing and Verification",
        "14. Applications and Future Scope",
        "15. Conclusion",
        "16. References",
    ]:
        story.append(p(entry, st["BodyReport"]))
    story.append(PageBreak())

    section(story, st, "4. List of Abbreviations", [])
    table(
        story,
        [
            ("API", "Application Programming Interface"),
            ("CI/CD", "Continuous Integration and Continuous Deployment"),
            ("DOM", "Document Object Model"),
            ("SPA", "Single Page Application"),
            ("UI/UX", "User Interface and User Experience"),
            ("YAML", "Yet Another Markup Language"),
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "5. Introduction",
        [
            "Task management applications help students, professionals, and teams organize their daily work. A strong task system allows users to create tasks, assign priorities, monitor progress, and review productivity through an easy-to-use interface.",
            "TaskFlow AI was developed as a modern React.js application that demonstrates frontend engineering and DevOps concepts. The project focuses on building a responsive and visually polished task management system while also showing how an application can be packaged and executed through Docker containers.",
        ],
    )
    story.append(p("5.1 Project Motivation", st["SubSection"]))
    bullets(
        story,
        st,
        [
            "To build a practical React.js application for classroom demonstration.",
            "To apply frontend concepts such as reusable components, routing, Context API, and responsive UI.",
            "To demonstrate Docker-based application packaging and Docker Compose orchestration.",
            "To include GitHub Actions as an automated verification pipeline.",
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "6. Literature Review and Technology Background",
        [
            "React.js is a JavaScript library for building component-based user interfaces. Vite improves the development experience by providing fast builds and a simple configuration model.",
            "Tailwind CSS is a utility-first CSS framework that supports consistent and responsive interface design. Docker packages applications and dependencies into isolated containers, while Docker Compose starts multiple containers as one stack.",
        ],
    )
    story.append(p("6.1 Docker and DevOps", st["SubSection"]))
    story.append(p("Docker helps avoid the common 'works on my machine' problem by running applications in a consistent containerized environment. GitHub Actions provides CI/CD automation by building and checking the project whenever code is pushed.", st["BodyReport"]))
    story.append(PageBreak())

    section(story, st, "7. Objectives of the Project", [])
    bullets(
        story,
        st,
        [
            "Design and develop a complete task management application named TaskFlow AI.",
            "Implement React Router DOM, Context API, reusable components, and localStorage persistence.",
            "Provide dark/light theme, animations, charts, task filtering, sorting, and drag-and-drop reordering.",
            "Containerize frontend and backend services using Docker.",
            "Orchestrate services using Docker Compose.",
            "Automate project verification using GitHub Actions.",
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "8. Methodology",
        [
            "The project was developed in phases. First, functional requirements were identified for task creation, editing, deletion, completion, filtering, analytics, and theme settings. Next, the React folder structure was created with separate folders for components, pages, layouts, context, hooks, utilities, and routes.",
            "After implementing the frontend, Dockerfiles and Docker Compose configuration were added. The project was then built and verified locally using npm build commands and Docker Compose commands.",
        ],
    )
    story.append(PageBreak())

    section(story, st, "9. Requirements and Technology Stack", [])
    table(
        story,
        [
            ("Frontend", "React.js, Vite, JavaScript"),
            ("Styling", "Tailwind CSS"),
            ("Routing", "React Router DOM"),
            ("State Management", "Context API"),
            ("Persistence", "LocalStorage"),
            ("Animations", "Framer Motion"),
            ("Icons and Charts", "Lucide React and Recharts"),
            ("DevOps", "Docker, Docker Compose, GitHub Actions"),
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "10. System Design and Architecture",
        [
            "The system follows a modular frontend architecture. Pages are separated from reusable components, contexts, hooks, utilities, and routes. This improves maintainability and makes the project easier to understand and extend.",
        ],
    )
    table(
        story,
        [
            ("Frontend", "React.js SPA served by Nginx in Docker"),
            ("State Layer", "Context API for tasks, theme, user, and notifications"),
            ("Persistence", "Browser localStorage"),
            ("Backend", "Node.js Express service for health check and backend container demonstration"),
            ("Orchestration", "Docker Compose starts frontend and backend together"),
        ],
    )
    story.append(PageBreak())

    section(story, st, "11. Implementation Details", [])
    bullets(
        story,
        st,
        [
            "Landing, login, signup, dashboard, task list, task details, calendar, analytics, and settings pages are implemented.",
            "Task CRUD operations include add, edit, delete, complete, restore, and mark important.",
            "Search suggestions, filters, sorting, grid/list view, and drag-and-drop ordering improve usability.",
            "Framer Motion provides page transitions, card animations, and modal animations.",
            "Recharts displays productivity score, category distribution, priority distribution, and weekly productivity.",
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "12. Docker and DevOps Workflow",
        [
            "The frontend Dockerfile uses a multi-stage build. In the first stage, Node.js installs dependencies and builds the React application. In the second stage, Nginx serves the generated production files.",
            "Docker Compose defines the frontend and backend services. The frontend is mapped to localhost:8081 and the backend is mapped to localhost:3000. GitHub Actions validates Docker Compose, builds images, starts containers, checks backend health, verifies the frontend page, and then tears down the stack.",
        ],
    )
    table(
        story,
        [
            ("Frontend Container", "daily-task-manager-frontend"),
            ("Backend Container", "daily-task-manager-backend"),
            ("Frontend Image", "containerized-task-management-system-frontend:latest"),
            ("Backend Image", "containerized-task-management-system-backend:latest"),
        ],
    )
    story.append(PageBreak())

    section(story, st, "13. Testing and Verification", [])
    table(
        story,
        [
            ("npm run build", "Generates production frontend files successfully"),
            ("docker-compose up --build -d", "Builds and starts frontend and backend containers"),
            ("http://localhost:8081", "Loads the TaskFlow AI frontend"),
            ("http://localhost:8081/app/dashboard", "Verifies React Router SPA fallback"),
            ("http://localhost:3000/health", "Returns backend healthy status"),
        ],
    )
    story.append(PageBreak())

    section(story, st, "14. Applications and Future Scope", [])
    bullets(
        story,
        st,
        [
            "Personal daily task management for students and individuals.",
            "Academic demonstration of React frontend architecture.",
            "DevOps demonstration using Docker, Docker Compose, and GitHub Actions.",
            "Future enhancement: add real authentication, MySQL/MongoDB persistence, team collaboration, reminders, automated tests, and cloud deployment.",
        ],
    )
    story.append(PageBreak())

    section(
        story,
        st,
        "15. Conclusion",
        [
            "The TaskFlow AI project successfully demonstrates the development of a modern task management application using React.js and supporting frontend technologies. The application provides routing, task management, persistence, theme management, animations, and analytics.",
            "From the DevOps perspective, the project demonstrates Docker image building, Nginx-based frontend serving, backend containerization, Docker Compose orchestration, and GitHub Actions automation.",
            "The project strengthened understanding of frontend architecture, reusable components, state management, responsive design, containerization, and CI/CD workflow automation.",
        ],
    )
    story.append(PageBreak())

    section(story, st, "16. References", [])
    bullets(
        story,
        st,
        [
            "React Documentation: https://react.dev/",
            "Vite Documentation: https://vitejs.dev/",
            "Tailwind CSS Documentation: https://tailwindcss.com/",
            "Docker Documentation: https://docs.docker.com/",
            "GitHub Actions Documentation: https://docs.github.com/actions",
            "React Router Documentation: https://reactrouter.com/",
            "Framer Motion Documentation: https://www.framer.com/motion/",
            "Recharts Documentation: https://recharts.org/",
        ],
    )

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUT)


if __name__ == "__main__":
    build()
