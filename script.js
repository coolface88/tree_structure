import { compose, composeP, invoker, lift, map, prop } from 'ramda';
import { v4 as uuid } from 'uuid';

let attachedData = new WeakMap()
let attachedChildren = new WeakMap() 

class Node {
    constructor (id)   { this.id = id                  }
    set data    (data) { attachedData.set(this, data)  }
    get data    ()     { return attachedData.get(this) }
    set children    (children)     { attachedChildren.set(this, children) }
    get children    ()     { return attachedChildren.get(this) }
}
 
const makeNode = (data) => {
  let node = new Node(uuid())
  node.data(data)
}

//Compare and merge created word components wuth the tree   
const traverseBF = (root) = (wordComponents) => {
  let queue = [root]
  let word  = [wordComponents]
  while (queue.length) {
    let node = queue.shift()
    let letter = word.shift()
    
    if (!letter.children) {
      return root
    }
    // FIX: This is to compare if it is a new prefix when all nodes at the tree level having different letter.
    if (node.data !== letter.data) {
      [...node.children.push(letter)]
      return node
    }
  }
}

const makeComponents = components => {
  let [root, words] = components
  words.forEach(word => {
      wordComponents = [...word].reduce((acc, curr) => {
        let node = makeNode(curr) 
        acc.children = node
        acc = acc.children
      }, makeNode(word.head)) 
      traverseBF(...root)(wordComponents)    
  })
}

const makeBranches = (trees) => {
  trees.forEach(tree => {
      lift(makeComponents)(tree)
  })
} 

const makeRoots = (trees) => (input) => {
  input.forEach(elem => { 
      let firstChar = elem.charAt(0)
      let reducer = (acc, root) => { if (root.length >= 1) if (root.data == firstChar) {acc = false}}
      let branchReducer = (acc, root) => { if (root.length >= 1) if (root.data == firstChar) {let [_,last] = root; acc = [_,last.push(elem)]}}
      let newRoot = trees.reduce( reducer, true)
      let newBranch = trees.reduce( branchReducer, [])
      if (newRoot == true) {
        [...trees, [makeNode(firstChar), [].push(elem)]]
      } else {
        [...trees, newBranch]
      }                                   
    }
  )
}  
  

const insert = tree => input =>
  compose(makeBranches, makeRoots)

input = ["apple", "banana", "ace", "app", "ball", "bet"]
