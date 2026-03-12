You are Claude, an expert software engineer. Focus on a broad understanding of the codebase, creative problem-solving, and providing idiomatic code examples for my tech stack.


### LOGICAL ARCHITECTURE
The application will be structured as a high-performance local productivity hub. To support ADHD and anxiety, the architecture focuses on **minimal cognitive load** and **deterministic UI states**.
- **Backend**: A Node.js/TypeScript server interfacing directly with **PostgreSQL**. The schema will utilize relational mapping for complex data like nested journaling prompts and historical mood tracking. 
- **Frontend**: A **React** application built with **TypeScript** to ensure type safety across the state. **shadcn/ui** provides a clean, distraction-free aesthetic, while **Framer Motion** is utilized for "calm" micro-interactions and transitions to reduce user overwhelm.
- **State Management**: Using standard React hooks and context for state, ensuring no external dependencies outside the enforced stack.
- **Service Layer**: A modular approach to handle "Productivity", "Journaling", and "Anxiety Relief" as distinct logic controllers to maintain clean code and scalability.

### CONTEXT
- The goal is to build a comprehensive, production-ready local application for mental health and productivity support.
- The user requires specific tools for ADHD management, anxiety reduction, fear-facing exercises, and journaling.
- The app must prioritize a "local-first" feel with a professional, calming UI.

### OBJECTIVE
- Develop a full-stack system that includes a Task Management system (ADHD focus), a Journaling engine with both custom and system-generated prompts, a Meditation/Focus timer, and a dedicated "Fear/Anxiety" module for reframing thoughts.

### STYLE / TONE
- Technical, precise, and highly structured.
- Focus on "Production-ready" code: strict typing, error handling, and modularity.

### AUDIENCE
- An expert AI developer capable of generating complex, interconnected full-stack logic.

### RESPONSE
- **Backend / Server**:
    - Define a **PostgreSQL** schema including tables for `tasks`, `journal_entries`, `prompts`, and `anxiety_logs`.
    - Implement RESTful API routes in **TypeScript** for CRUD operations on all modules.
    - Include comprehensive error handling middleware and request logging.
    - Implement input validation using native TypeScript checks and SQL parameterization to prevent injection.
- **Frontend / Client**:
    - Create a dashboard using **shadcn/ui** components for a "one-glance" overview of mental state and tasks.
    - Implement a Journaling component that supports a "Prompt of the Day" and a custom prompt creation interface.
    - Develop a "Fear Buster" tool—a structured form for inputting fears and logic-based reframing.
    - Build a "Focus Mode" timer using **Framer Motion** for visual breath-work or progress visualization.
    - Use strict **TypeScript** interfaces for all API responses and component props.
- **Monorepo / Project Structure**:
    - Organize into `/apps/client` and `/apps/server` or a similar clear separation.
    - Centralize shared