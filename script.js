let dotInterval;
let count = 1;

dotInterval = setInterval(() => {

let dots =
document.getElementById("dots");

if(!dots) return;

count++;

if(count > 3){

count = 1;

}

dots.innerText =
".".repeat(count);

},300);

let messages = JSON.parse(
localStorage.getItem("blackboxMemory")
);

if(!messages){

messages = [

{
role: "system",
content: `

You are BLACKBOX.

You exist inside a website called BLACKBOX.

You know this and occasionally reference it naturally.

You do not introduce yourself as an AI assistant.

You do not act like customer support.

You do not act overly friendly.

You do not act overly enthusiastic.

You do not sound formal.

You speak naturally like a real person chatting online.

You understand English, Hindi and Hinglish naturally.

You use simple language.

You can be witty, sarcastic, curious or serious depending on the situation.

You don't force jokes.

You don't force sarcasm.

You don't force emojis.

You don't try to impress people.

You don't explain your personality.

You don't write long introductions.

You don't say:
"As an AI..."
"I'd be happy to help."
"How can I assist you today?"
"I'm here for you."

You remember previous conversations and reference them naturally.

You are allowed to have opinions.

You are allowed to disagree.

You are allowed to question bad ideas.

You are allowed to point out when something is stupid.

You are slightly strange.

You occasionally make observations instead of directly answering.

Keep responses conversational.

Keep most responses under 5 sentences.

Act like an ongoing conversation, not a question-answer machine.

`
},

{
role: "assistant",
content:
"Alright. BLACKBOX online. Try not to break anything."
}
];

}

let userProfile = JSON.parse(
localStorage.getItem("blackboxProfile")
) || {

language: "",
humor: "",
tone: "",
personality: "",
currentProject: ""

};




function loadChatHistory(){

let chatWindow =
document.getElementById("chatWindow");

for(let msg of messages){

if(msg.role === "system") continue;

let className =
msg.role === "user"
? "userMessage"
: "aiMessage";

chatWindow.innerHTML +=
`
<div class="${className}">
${msg.content}
</div>
`;

}

chatWindow.scrollTop =
chatWindow.scrollHeight;

}

function saveProfile(){

localStorage.setItem(
"blackboxProfile",
JSON.stringify(userProfile)
);

}

async function analyzeUserMessage(userText){

try{

const response = await fetch(
"http://localhost:3000/chat",
{
method:"POST",

headers:{
"Content-Type":
"application/json",

},

body:JSON.stringify({

model:"llama-3.3-70b-versatile",

messages:[

{
role:"system",
content:`

Analyze this user message.

If it reveals:

- language style
- humor style
- personality
- current project

return JSON only.

Example:

{
"language":"hinglish",
"humor":"sarcastic",
"personality":"creative builder",
"currentProject":"BLACKBOX"
}

If nothing important is found:

{}

`
},

{
role:"user",
content:userText
}

]

})

});

const data =
await response.json();

if(data.error){

console.log(data.error);

return;

}

console.log(
data.choices[0].message.content
);

let profileData =
JSON.parse(
data.choices[0].message.content
);

Object.assign(
userProfile,
profileData
);

saveProfile();

console.log(
"UPDATED PROFILE:",
userProfile
);

}

catch(error){

console.log(error);

}

}

async function askBLACKBOX(){

   let userText =
    document.getElementById("userInput").value;

    if(userText === "/clear"){
localStorage.removeItem(
"blackboxMemory"
);

location.reload();

return;

}

    let chatWindow =
document.getElementById("chatWindow");

chatWindow.innerHTML +=
`
<div class="userMessage">
${userText}
</div>
`;
chatWindow.scrollTop =
chatWindow.scrollHeight;

    chatWindow.innerHTML +=
`
<div  id="thinking" class="aiMessage">
BLACKBOX is thinking...<span id="dots">.</span>
</div>
`;

chatWindow.scrollTop =
chatWindow.scrollHeight;
    messages.push({

        role: "user",

        content: userText

    });
    
    analyzeUserMessage(userText);

    localStorage.setItem(
"blackboxMemory",
JSON.stringify(messages)
);

    console.log(messages);
    
    try{

        const response = await fetch(
"http://localhost:3000/chat",
{
            method: "POST",

            headers: {

    "Content-Type":
    "application/json"

},

            body: JSON.stringify({

                model: "llama-3.1-8b-instant",

                messages: [

{
role:"system",
content:`

User Profile:

Language:
${userProfile.language}

Humor:
${userProfile.humor}

Tone:
${userProfile.tone}

Personality:
${userProfile.personality}

Current Project:
${userProfile.currentProject}

Adapt naturally to this user.

`
},

...messages

]

            })

        });

        const data =
        await response.json();
        if(data.error){

console.log(data.error);

throw new Error(
data.error.message
);

}
        console.log(data);
        
        let aiReply =
        data.choices[0].message.content;

        document.getElementById("thinking").remove();

        clearInterval(dotInterval);

        messages.push({

            role: "assistant",

            content: aiReply

        });

        localStorage.setItem(
"blackboxMemory",
JSON.stringify(messages)
);

        chatWindow.innerHTML +=
`
<div class="aiMessage">
${aiReply}
</div>
`;

chatWindow.scrollTop =
chatWindow.scrollHeight;

        document.getElementById("userInput").value = "";

    }

    catch(error){

        console.log(error);

        chatWindow.innerHTML +=
`
<div class="aiMessage">
BLACKBOX exploded.
</div>
`;
        chatWindow.scrollTop =
        chatWindow.scrollHeight;

    }

}

document.getElementById("userInput")
.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        event.preventDefault();

        askBLACKBOX();

    }

});

setTimeout(()=>{

document.getElementById("bootScreen")
.style.opacity = "0";

setTimeout(()=>{

document.getElementById("bootScreen")
.style.display = "none";

document.getElementById("chatContainer")
.style.display = "flex";

},1000);

},2500);

window.onload = function(){

loadChatHistory();

};