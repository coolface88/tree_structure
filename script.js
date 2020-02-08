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
 
let input = ["apple", "banana", "ace", "app", "ball", "bet"]

const makeNode = (data) => {
  let node = new Node(uuid())
  node.data(data)
}

const traverseBF = (callback) = (root) = (wordComponents) => {
  let queue = [root]
  let word  = [wordComponents]
  const sameLevelNodes = root => {
    let arr = [[root]]
    if (root.children) {
      for(var i = 0 ; i < root.children.length; i++) {
        var child = root.children[i];
        [...arr, [].push(child)]
      }
      for(var i = 0 ; i < root.children.length; i++) {
        var child = root.children[i];
        sameLevelNodes(child);
      }   
    }
  }
  while (queue.length) {
    let node = queue.shift()
    let letter = word.shift()
    let newPrefix = true
    
    if (!letter.children) {
      return root
    }
    if (node.data !== letter.data) {
      [...node.children.push(letter)]
      return node
    }
    if (newPrefix === true) {
      
    }
    if (node.data === letter.data && node.children) {
      queue.push(...node.children)
    } else if (node.data === letter && position === level && node.children) {
      
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
      traverseBF(mergeNode)(...root)(wordComponents)    
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
  
const makeTree = tree => newTree => [...tree, newTree]


const insert = tree => input =>
  compose(makeTree, makeBranches, makeRoots)


