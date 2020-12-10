import { GameSystem } from './gamesystem.js'


let gameSystem = new GameSystem();

let playerElementList = []

$("#game").bind("changed", (e) => {
    let newData = {}

    newData[e.detail.propertyName] = e.detail.newValue;
    
    $.post({
        url: "http://localhost:5000/updateGame",
        data: newData,
        dataType: "json",
    });
})

function updateSystem() {
    $.ajax({
        url: "http://localhost:5000/getSystem"
    }).then((data) => {
        gameSystem.receiveSystemUpdate(data)

        $("#players").empty();

        playerElementList = []

        for (let k in data.game) {
            let v = data.game[k];
            console.log(k, v);
            $("#game").prop(k, v);
        }

        for (let i in data.players) {
            let p = data.players[i];

            let newPlayerElement = document.createElement("player-element");

            newPlayerElement["playerNum"] = new Number(i);
            newPlayerElement["playerName"] = p.playerName;
            newPlayerElement["oxygen"] = p.oxygen;
            newPlayerElement["isDead"] = p.isDead;

            playerElementList.push(newPlayerElement);

            newPlayerElement.addEventListener("changed", (e) => {
                let newData = {}

                newData[e.detail.propertyName] = e.detail.newValue;
                
                $.post({
                    url: "http://localhost:5000/updatePlayer/" + newPlayerElement["playerNum"],
                    data: newData,
                    dataType: "json",
                });
            })

            $("#players").append(newPlayerElement)
        }
    });
}

function updateGame() {
    $.ajax({
        url: "http://localhost:5000/getGame"
    }).then((data) => {
        gameSystem.receiveGameUpdate(data)
    });
}

function updatePlayer(playerNum) {
    $.ajax({
        url: "http://localhost:5000/getPlayer/" + playerNum
    }).then((data) => {
        gameSystem.receivePlayerUpdate(data, playerNum)
    });
}

function receiveEvent(message) {
    let data = JSON.parse(message.data);
    
    if (data.type == "game") {
        gameSystem.receiveGameUpdate(data.content);
    }
    else if (data.type == "player") {
        gameSystem.receivePlayerUpdate(data.content, data.playerId);

        let playerElement = playerElementList[data.playerId];

        playerElement["playerNum"] = data.playerId;
        playerElement["playerName"] = data.content.playerName;
        playerElement["oxygen"] = data.content.oxygen;
        playerElement["isDead"] = data.content.isDead;
    }
}


let eventSource = new EventSource("http://localhost:5000/notifications_stream");

eventSource.onmessage = (message) => {
    receiveEvent(message);
};

// $("#refresh-btn").on("click", () => {
//     updateSystem();
// })
// 
// for (var i = 0 ; i < 4 ; i++) {
//     let fieldList = ["name", "oxygen"]
//     for (var f in fieldList) {
//         let fieldName = fieldList[f]
//         var el = document.getElementById("player-" + i + "-" + fieldName + "-btn");
//         el.addEventListener("click",
//         () => {
//             editPlayer(i, fieldName)
//         }, false);
//     }
// }

updateSystem();