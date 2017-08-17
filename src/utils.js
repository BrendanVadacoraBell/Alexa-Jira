module.exports = {

    getRandomIntroMessage: function (introList) {
        return introList[Math.floor(Math.random()*introList.length)];
    }

}