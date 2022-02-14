let messages = [];
let content = document.querySelector("main");
let nameInput;
let firstTime = true;
let InicialIndex = 0;
let lastMessage = "";

// Login --------------

async function loginChat() {
    nameInput = prompt("Bem vindo ao chat UOL, digite seu nome: ");

    const promiseParticipants = await axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: nameInput }).then(succed()).catch(error)
}

function succed() {
    callMessages();
}

function error() {
    loginChat();
}

loginChat()


// Message Load ------------

function callMessages() {

    const promiseMessage = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')

    promiseMessage.then(function (response) {

        messages = response.data


        if (firstTime == false) {

            for (let i = messages.length - 1; i > 1; i--) {

                if (lastMessage === messages[i].from + messages[i].text + messages[i].time) {

                    InicialIndex = i + 1;

                    break

                }

            }
        }


        content.innerhtml = "";


        for (let i = InicialIndex; i < messages.length; i++) {


            if (messages[i].type === "private_message" && messages[i].to == nameInput) {
                content.innerHTML += `    
                <div class="message-container ${messages[i].type} data-identifier="message"">
                    <div class="message-structure">
                        <span class="time">(${messages[i].time}) </span>  
                        <span class="from"><b>${messages[i].from}</b></span> 
                        <span class="type"> reservadamente para <span class="to">${messages[i].to}:</span></span>
                        <span class="text">${messages[i].text}</span>
                    </div>
                </div>`

            } else if (messages[i].type === "private_message" && messages[i].to != nameInput) {
                break;

            } else if (messages[i].type === "message") {
                content.innerHTML += ` 
                <div class="message-container ${messages[i].type} data-identifier="message"">
                    <div class="message-structure ">
                        <span class="time">(${messages[i].time})</span>  
                        <span class="from"><b>${messages[i].from}</b></span> 
                        <span class="type">  para <span class="to">${messages[i].to}:</span></span>
                        <span class="text">${messages[i].text}</span>
                    </div>
                </div>`
            } else if (messages[i].type === "status") {

                content.innerHTML += `
                <div class="message-container ${messages[i].type} data-identifier="message"">
                    <div class="message-structure ">
                        <span class="time">(${messages[i].time})</span>  
                        <span class="from"><b>${messages[i].from}</b></span> 
                        <span class="text"> ${messages[i].text}</span>
                    </div>
                </div>`
            }

            let lastChild = content.childNodes[content.childNodes.length - 1]

            lastChild.scrollIntoView({ behaviour: "smooth" })
        }


        promiseMessage.catch(function (erro) {
            alert(erro)

        })

        lastMessage = messages[99].from + messages[99].text + messages[99].time;
    })

    firstTime = false;

}

setInterval(callMessages, 3000);

// Send Message --------------

function sendMessages() {

    let messageWritten = document.querySelector("input[name='foot_message']").value

    if (messageWritten.length === 0) return;

    const promiseSendMessage = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', {
        from: nameInput,
        to: "Todos", // (Todos se não for um específico)",
        text: messageWritten,
        type: "message" // ou "private_message" para o bônus
    })

    promiseSendMessage.then((response) => {
        callMessages();
        document.querySelector("input[name='foot_message']").value = "";
    })

    promiseSendMessage.catch((erro) => {
        window.location.reload()
    })
}

// Keep Login -------------

function keepLoggedIn() {

    let promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {
        name: nameInput
    })
}

setInterval(keepLoggedIn, 5000)