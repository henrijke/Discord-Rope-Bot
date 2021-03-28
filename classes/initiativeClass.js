// ES6 style
// class Initiative {
//   userId;
//   name;
//   initiative;
//   constructor(userId, name, initiative) {
//     this.userId = userId;
//     this.name = name;
//     this.initiative = initiative
//   }
// }

function Initiative(userId, name, initiative) {
    this.userId = userId;
    this.name = name;
    this.initiative = initiative
}

module.exports = {
    Initiative: Initiative
}
