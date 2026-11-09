const form = document.getElementById("assessmentForm");
const resultsSection = document.getElementById("results");
const formMessage = document.getElementById("formMessage");
const resultCards = document.getElementById("resultCards");
const overallMessage = document.getElementById("overallMessage");
const recommendationList = document.getElementById("recommendationList");
const retakeButton = document.getElementById("retakeButton");

const sections = [
    {
        title: "Physical & Emotional Exhaustion",
        questions: ["q1", "q2", "q3"],
        recommendations: [
            "Take short, regular breaks during the workday.",
            "Review your workload and divide large tasks into smaller steps.",
            "Try to keep a healthy routine for sleep, meals, and rest."
        ]
    },
    {
        title: "Mental Distance",
        questions: ["q4", "q5", "q6"],
        recommendations: [
            "Set small and realistic goals for your workday.",
            "Talk with a trusted colleague or manager about work challenges.",
            "Make time for activities outside work that you enjoy."
        ]
    },
    {
        title: "Professional Efficacy Concerns",
        questions: ["q7", "q8", "q9"],
        recommendations: [
            "Break difficult tasks into smaller, achievable steps.",
            "Notice your progress and recognize small achievements.",
            "Ask for feedback, guidance, or training when you need it."
        ]
    }
];

function getLevel(score) {
    if (score <= 3) {
        return { name: "Low indicators", className: "level-low", color: "#4d806e" };
    }

    if (score <= 6) {
        return { name: "Moderate indicators", className: "level-moderate", color: "#c18a35" };
    }

    return { name: "High indicators", className: "level-high", color: "#bd655b" };
}

function getSectionScore(questionNames) {
    let total = 0;

    for (let i = 0; i < questionNames.length; i++) {
        const selected = document.querySelector(
            'input[name="' + questionNames[i] + '"]:checked'
        );

        total += Number(selected.value);
    }

    return total;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const unanswered = [];

    for (let i = 1; i <= 9; i++) {
        const answer = document.querySelector('input[name="q' + i + '"]:checked');

        if (answer === null) {
            unanswered.push(i);
        }
    }

    if (unanswered.length > 0) {
        formMessage.textContent =
            "Please answer all 9 questions before viewing your results.";
        const firstMissing = document.querySelector(
            'input[name="q' + unanswered[0] + '"]'
        );
        firstMissing.closest(".question-card").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        return;
    }

    formMessage.textContent = "";
    resultCards.innerHTML = "";
    recommendationList.innerHTML = "";

    let highSections = 0;

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const score = getSectionScore(section.questions);
        const level = getLevel(score);

        if (score >= 7) {
            highSections++;
        }

        const card = document.createElement("div");
        card.className = "result-card";

        const heading = document.createElement("h3");
        heading.textContent = section.title;

        const scoreLine = document.createElement("div");
        scoreLine.className = "score-line";

        const scoreText = document.createElement("span");
        scoreText.textContent = "Your score";

        const scoreNumber = document.createElement("strong");
        scoreNumber.textContent = score + " / 9";

        scoreLine.appendChild(scoreText);
        scoreLine.appendChild(scoreNumber);

        const track = document.createElement("div");
        track.className = "progress-track";

        const fill = document.createElement("div");
        fill.className = "progress-fill";
        fill.style.width = (score / 9 * 100) + "%";
        fill.style.backgroundColor = level.color;

        track.appendChild(fill);

        const status = document.createElement("p");
        status.className = level.className;
        status.textContent = level.name;

        card.appendChild(heading);
        card.appendChild(scoreLine);
        card.appendChild(track);
        card.appendChild(status);
        resultCards.appendChild(card);

        if (score >= 4) {
            const group = document.createElement("div");
            group.className = "recommendation-group";

            const recommendationHeading = document.createElement("h4");
            recommendationHeading.textContent = section.title;

            const list = document.createElement("ul");

            for (let j = 0; j < section.recommendations.length; j++) {
                const item = document.createElement("li");
                item.textContent = section.recommendations[j];
                list.appendChild(item);
            }

            group.appendChild(recommendationHeading);
            group.appendChild(list);
            recommendationList.appendChild(group);
        }
    }

    if (highSections === 0) {
        overallMessage.textContent =
            "Your answers show low or moderate indicators across the three areas. Keep checking in with yourself and maintain healthy work habits.";
    } else {
        overallMessage.textContent =
            "Your answers show high indicators in one or more areas. Consider the suggestions below and seek support if these feelings continue or affect your daily life.";
    }

    if (recommendationList.children.length === 0) {
        recommendationList.textContent =
            "No specific recommendations were triggered by these scores. Continue maintaining healthy work habits and check in with yourself regularly.";
    }

    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

retakeButton.addEventListener("click", function () {
    form.reset();
    formMessage.textContent = "";
    resultsSection.hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
});
