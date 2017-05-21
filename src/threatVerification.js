'use scrict'

const printChat = require('./printChat.js')

// checks if a node threat has a connection to a node constraint
module.exports = function threatVerification (cy) {
  let arrThreat = [] // array with all threats
  let arrMitigated = [] // array with mitigated threats
  let result = '' // posted on the nodeInfo div

  cy.nodes().map((node) => {
    // checks in node is threat and adds to arrThreat
    if (node.data().info.concept === 'threat') {
      node.addClass('attention')
      arrThreat.push(node.data().id)
      // stores the neigborring nodes of the threats
      const neighborNodes = node.neighborhood()
      const neighborInfo = neighborNodes.data().info

      // check which threat has a constraint neighbor
      Object.keys(neighborInfo).map((i) => {
        if (neighborInfo[i] === 'constraint') {
          arrMitigated.push(node.data().id)
          result = `${result} • Threat ${node.data().id} is mitigated by constraint ${neighborNodes.data().id}\n`
        }
      })
    }
    if (node.data().info.concept === 'constraint') {
      node.addClass('protect')
    }
  })
  // checks the arrays to see which threat is not mitigated
  const setMitigated = new Set(arrMitigated)
  // const threats = new Set([...arrThreat].filter(threat => !setMitigated.has(threat)))
  const threats = new Set([...arrThreat].filter((threat) => {
    !setMitigated.has(threat)
  }))

  threats.forEach((i) => {
    result = `${result} • Threat ${i} is not mitigated\n`
  })

  // result will be displayed at info-for-nodes div
  result = `${result} • Threats total: ${arrThreat.length}\n`
  result = `${result} • Mitigated total: ${arrMitigated.length}\n`
  printChat(result)
}
