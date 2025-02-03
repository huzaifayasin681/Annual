
# **Annual Dinner Quiz Game**

Welcome to the **Annual Dinner Quiz Game**—an interactive Next.js 13 application designed to entertain and engage participants at UiiT IT’s Annual Dinner. The application features a fun quiz with **Yes/No**, **Multiple-Choice**, and **Input** questions, complete with animations, a blast effect for correct answers, and a festive design.

## **Table of Contents**

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Getting Started](#getting-started)  
5. [Usage](#usage)  
6. [EmailJS Integration](#emailjs-integration)  
7. [Deployment](#deployment)  
8. [License](#license)  

---

## **Features**

- **Annual Dinner Theme:** Vibrant UI design with a background video, transparent cards, and festive tagline.  
- **Dynamic Questions:** Supports Yes/No, MCQ, and open-ended Input questions.  
- **Animation & Effects:** Uses [Framer Motion](https://www.framer.com/motion/) for smooth transitions, blast effects, and a checkmark icon.  
- **Scoring & Feedback:** Displays user’s score, correct/wrong feedback, and fun facts for each question.  
- **Special Insults:** If the first Yes/No question is answered with "No," a humorous insult is displayed.  
- **EmailJS Integration:** Automatically sends quiz results (answers & score) to an admin email when the game ends.

---

## **Tech Stack**

- **Next.js 13** (App Router)  
- **React** for UI components  
- **Tailwind CSS** for styling  
- **Framer Motion** for animations  
- **EmailJS** for sending result emails  
- **Node.js** environment

---

## **Project Structure**

```
.
├── app
│   ├── page.js               // Home component (entry page)
│   └── game
│       └── page.js           // Game page, imports GameBoard
├── components
│   ├── GameBoard.js          // Main quiz logic
│   ├── QuestionCard.js       // Renders individual questions
│   ├── BlastEffect.js        // Explosion animation for correct answers
│   ├── AnimatedIcon.js       // Checkmark icon animation
│   └── ...
├── public
│   ├── data
│   │   └── questions.json    // JSON with all quiz questions
│   ├── Video.mp4             // Background video file
│   ├── IT.webp               // Example welcome image
│   └── ...
├── package.json
├── README.md                 // You are here
└── ...
```

---

## **Getting Started**

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/annual-dinner-quiz-game.git
   ```

2. **Install Dependencies**  
   ```bash
   cd annual-dinner-quiz-game
   npm install
   ```

3. **Run the Development Server**  
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## **Usage**

1. **Home Screen**  
   - Displays a **vertical background video** with a **transparent card**.  
   - Users enter their **name** and a **modal** welcomes them before redirecting to the game page.

2. **Game Page**  
   - Renders the **GameBoard** component with a series of questions:
     - **Yes/No** questions (two buttons).  
     - **MCQ** questions (multiple choice).  
     - **Input** questions (open text input).  
   - **Score** and **Level** are displayed.  
   - **BlastEffect** and **AnimatedIcon** appear on correct answers.  
   - **Fun facts** overlay displays after each question.  
   - A **special insult** appears if the first question is answered “No.”  

3. **Game Over**  
   - Final score is shown.  
   - Results are **emailed** to the admin via **EmailJS**.  
   - Option to restart the quiz.

---

## **EmailJS Integration**

This project uses [EmailJS](https://www.emailjs.com/) to send quiz results to an admin email. Key points:

- Credentials (`SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY`) are **hard-coded** in `GameBoard.js` for simplicity.  
- `emailjs.send(...)` is called inside a `useEffect` whenever `gameOver` becomes true.  
- The template includes placeholders for **`from_name`**, **`score`**, and **`answers`**. Make sure to match these fields in your EmailJS dashboard template.

**Relevant Code Snippet** (from `GameBoard.js`):

```js
import emailjs from '@emailjs/browser';

const SERVICE_ID = "your_service_id";
const TEMPLATE_ID = "your_template_id";
const PUBLIC_KEY = "your_public_key";

// ...

useEffect(() => {
  if (gameOver) {
    sendEmailToAdmin();
  }
}, [gameOver]);

const sendEmailToAdmin = () => {
  const answersString = userAnswers.map((item) => 
    `Q${item.questionId}: ${item.question}\nAnswer: ${item.answer}\n`
  ).join("\n");

  const templateParams = {
    to_name: "Admin",
    from_name: userName,
    score: score,
    answers: answersString
  };

  emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
    .then(() => {
      console.log("Email sent successfully!");
    })
    .catch((error) => {
      console.error("Email sending failed:", error);
    });
};
```

---

## **Deployment**

### **Vercel** (Recommended)

1. **Push** your code to **GitHub**.  
2. **Login** to [Vercel](https://vercel.com/) and import your repository.  
3. Configure as a **Next.js** project (no extra steps usually needed).  
4. **Deploy** and get your live URL (e.g. `your-app.vercel.app`).

### **Netlify** or Other Platforms

- Adjust build settings as needed.  
- Next.js SSR may require specific plugins or runtime configurations on Netlify.

---

## **License**

This project is provided for demonstration and educational purposes. You can adapt the license to your needs (e.g., MIT, Apache, etc.). For example:

```
MIT License
Copyright (c) 2025 ...
Permission is hereby granted, free of charge, to any person obtaining a copy ...
```

---

**Enjoy your Annual Dinner Quiz Game!** Feel free to customize questions, design, or add new features like timers, leaderboards, or additional email notifications. If you have any suggestions or encounter issues, open a PR or contact the project maintainers. Good luck and have fun!