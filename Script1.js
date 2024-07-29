let currentQuestionNumber = 0;
let score = 0;
let questionsAsked = 0;
const maxQuestions = 10; // Change to the number of questions you want to ask (e.g., 10)

const questions = {
    1: { 
        question: "Write a regex pattern to match the word hello exactly, ensuring it is not part of another word (e.g., hello should match but hello123 should not)", 
        answers: [
            "\\bhello\\b",                      // Word boundary
            "(?<!\\w)hello(?!\\w)",             // Negative lookbehind and lookahead for word characters
            "(^|\\s)hello($|\\s)",               // Match hello at start or end of a string or surrounded by spaces
            "\\shello\\s|^hello\\s|\\shello$",  // Match hello surrounded by spaces or at the edges
            "^hello$",                           // Match hello as a whole string
            "hello(?=\\s|$)",                   // Match hello followed by whitespace or end of line
            "(^|[^a-zA-Z0-9])hello($|[^a-zA-Z0-9])" // Match hello not surrounded by alphanumeric characters
        ] 
    },
    2: { 
        question: "Create a regex to find any single digit (0-9) in a text. For example, it should match in There are 3 apples but not in There are apples", 
        answers: [
            "\\d",                           // Matches any digit (equivalent to [0-9])
            "[0-9]",                        // Matches any digit using the character class
            "(?<!\\d)[0-9](?!\\d)",        // Matches a digit that is not preceded or followed by another digit
            "\\b[0-9]\\b",                 // Matches a single digit as a whole word
            "(?<=\\D)[0-9](?=\\D)",        // Matches a digit that is surrounded by non-digit characters
            "^\\d$",                       // Matches a single digit as the only content of a string
            "(^|\\D)[0-9](?=\\D|$)"         // Matches a digit that is either at the start or end of the string, or surrounded by non-digit characters
        ] 
    },
    3: { 
        question: "Write a regex pattern that matches a simple email address format. It should include a local part (before the @) and a domain part (after the @). For instance, it should match example@domain.com", 
        answers: [
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", // Standard email format
            "^[\\w.%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$",      // Similar format using \\w
            "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",                   // Matches any non-whitespace characters before and after @
            "^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" // Allows for multiple special characters in local part
        ]  
    },
    4: { 
        question: "Write a regex pattern to find phone numbers in the format (123) 456-7890.", 
        answers: [
            "\\(\\d{3}\\) \\d{3}-\\d{4}",                        // Standard format with parentheses and hyphen
            "\\(\\d{3}\\)\\s\\d{3}-\\d{4}",                      // Allows optional space after the parentheses
            "\\(\\d{3}\\) \\d{3}-\\d{4}|\\d{3}-\\d{3}-\\d{4}",  // Matches the standard format or alternative format with hyphens
            "\\(\\d{3}\\) \\d{3}-\\d{4}|\\d{3}\\.\\d{3}\\.\\d{4}" // Matches the standard format or format with periods
        ] 
    },
    5: { 
        question: "Create a regex pattern that matches URLs starting with http:// or https://. It should allow for a domain name and an optional port number and path.", 
        answers: [
            "https?://[a-zA-Z0-9.-]+(\\:[0-9]+)?(/[^ ]*)?",                      // Standard format allowing optional port and path
            "https?://[a-zA-Z0-9.-]+(:[0-9]+)?(/[\\w./-]*)?",                   // Similar to standard but allows alphanumeric and certain special characters in the path
            "https?://[A-Za-z0-9.-]+(:[0-9]{1,5})?(/[\\S]*)?",                 // Matches valid port range and ensures no whitespace in the path
            "https?://([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(/[\\S]*)?" // Matches domain with subdomains and valid top-level domains
        ] 
    },
    6: { 
        question: "Write a regex pattern to match dates in the format YYYY-MM-DD, ensuring that the year is between 1900 and 2099. The month is valid (01 to 12). The day is valid for the corresponding month (considering leap years is not required for this task)", 
        answers: [
            "^(19|20)\\d\\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$",  // Standard format ensuring year, month, and day validity
            "^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|1\\d|2[0-9]|30)$",  // Adjusted for 30 days in a month
            "^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|1\\d|2[0-9]|31)$",  // General pattern allowing up to 31 days (no month validation)
            "^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|1\\d|2[0-9]|3[01])$" // Alternative format, same as the first for flexibility
        ] 
    },
    7: { 
        question: "Create a regex pattern that matches a hexadecimal color code. The code should start with a `#` followed by either three or six hexadecimal digits (0-9, A-F)", 
        answers: [
            "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",                       // Standard format for 3 or 6 hexadecimal digits
            "^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$",                       // Alternative order of matching groups (3 or 6 digits)
            "^#[0-9A-Fa-f]{3,6}$",                                      // Matches a `#` followed by 3 to 6 hexadecimal digits
            "^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$"                      // Non-capturing group for 3 or 6 hexadecimal digits
        ] 
    },
    8: { 
        question: "Write a regex pattern to match usernames that start with a letter (a-z, A-Z). Are followed by 4 to 15 characters that can be letters, numbers, or underscores.", 
        answers: [
            "^[a-zA-Z][a-zA-Z0-9_]{4,15}$",                             // Standard format with a letter followed by 4 to 15 alphanumeric characters or underscores
            "^[A-Za-z][A-Za-z0-9_]{4,15}$",                             // Same as above, using an alternative case-insensitive character class
            "^[a-zA-Z][\\w]{4,15}$",                                   // Uses \\w to match any word character (letter, digit, underscore)
            "^[a-zA-Z]{1}[a-zA-Z0-9_]{4,15}$"                         // Explicitly defines the first letter and the following characters
        ] 
    },
    9: { 
        question: "Create a regex pattern that matches any string that contains at least one vowel (a, e, i, o, u). The sentence can be of any length, including spaces and punctuation.", 
        answers: [
            "^(?=.*[aeiou]).+$",                                          // Standard lookahead to ensure at least one vowel exists
            ".*[aeiou].*",                                               // Matches any string that contains at least one vowel
            "(?i).*[aeiou].*",                                          // Case-insensitive match for at least one vowel
            ".*[AEIOUaeiou].*"                                          // Explicitly matches both uppercase and lowercase vowels
        ] 
    },
    10: { 
        question: "Write a regex pattern to match numbers formatted with commas as thousands separators. For example, it should match 1, 1,000, and 1,234,567 but not 1000 or 1,00,000.", 
        answers: [
            "^\\d{1,3}(,\\d{3})*$",                                      // Standard format for numbers with commas
            "^(\\d{1,3})(,\\d{3})*$",                                   // Starts with 1 to 3 digits followed by any number of groups of 3 digits
            "^(\\d{1,3}(,\\d{3})*)?$",                                  // Optional match for numbers that might not contain any groups
            "^\\d{1,3}(?:,\\d{3})*$"                                    // Non-capturing group for additional thousands separators
        ] 
    },
    11: { question: "", answers: [""] },
    12: { question: "", answers: [""] },
    13: { question: "", answers: [""] },
    14: { question: "", answers: [""] },
    15: { question: "", answers: [""] }
};

function generateQuestion() {
    if (questionsAsked >= maxQuestions) {
        gameOver();
        return;
    }

    // Generate a random number between 1 and 15
    currentQuestionNumber = Math.floor(Math.random() * 15) + 1;

    // Ensure the question hasn't been asked before
    while (questions[currentQuestionNumber].asked) {
        currentQuestionNumber = Math.floor(Math.random() * 15) + 1;
    }

    // Mark question as asked
    questions[currentQuestionNumber].asked = true;

    // Display the corresponding question
    const questionElement = document.getElementById("question");
    questionElement.innerHTML = `<p><span class="typing-animation"><strong>Question ${questionsAsked + 1}:</strong> ${questions[currentQuestionNumber].question}</span></p>`;
    
    questionsAsked++;
}

// Function to validate if the answer field is empty
function validateAnswer() {
    const userAnswer = document.getElementById("answer").value.trim();
    if (userAnswer === "") {
        alert("Please enter an answer.");
        return false;
    }
    return true;
}

function checkAnswer() {
    // Validate if answer field is empty
    if (!validateAnswer()) {
        return;
    }

    const userAnswer = document.getElementById("answer").value.trim();
    const correctAnswers = questions[currentQuestionNumber].answers.map(answer => answer.toLowerCase());

    if (correctAnswers.includes(userAnswer.toLowerCase())) {
        score++;
        alert("Correct!");
    } else {
        alert(`Incorrect. The correct answer is: ${correctAnswers.join(", ")}`);
    }

    // Display score
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;

    // Generate next question or end game
    generateQuestion();
}

function gameOver() {
    // Display game over message
    const questionElement = document.getElementById("question");
    questionElement.innerHTML = `<p><span class="typing-animation"><strong>GAME OVER</strong></span></p>`;

    // Display final score
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Final Score: ${score}, better luck next time!`;

    // Disable answer input and check button
    document.getElementById("answer").disabled = true;
    document.querySelector("button").disabled = true;
}

// Initial question generation
generateQuestion();
