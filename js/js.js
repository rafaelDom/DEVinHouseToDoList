function inserirItemLista(){

    const textInput = getTextInput();
    if(textInput == false){
        return
    }
    
    adicionarItemNaLista(textInput)
    addLocalStorage(textInput)
    cleanInputText()
}

function getTextInput(){
    const textInput = document.getElementById('itemLista').value

    if(textInput == ''){
        alert('Favor digitar descrição do Item')
        return false
    }

    return textInput
}

function adicionarItemNaLista(item){
    const lista = document.getElementById('lista')
    const itemLista = document.createElement('li')
    const textItemList = document.createElement('span')
    const inputCheck = document.createElement('input')
    inputCheck.setAttribute('type','checkbox')
    inputCheck.setAttribute('id','itemComprado')
    const deleteItem = document.createElement('i')
    deleteItem.setAttribute('class', 'fa fa-2x fas fa-times-circle')
    const buttonDelete = document.createElement('button')
    buttonDelete.appendChild(deleteItem)
    textItemList.innerText = item
    itemLista.appendChild(inputCheck)
    itemLista.appendChild(textItemList)
    itemLista.appendChild(buttonDelete)

    lista.appendChild(itemLista)

}

function cleanInputText(){
    document.getElementById('itemLista').value = ''
}

function addLocalStorage(itemLista){
    const itensLSStr = JSON.stringify(localStorage)
    const itensLS = JSON.parse(itensLSStr);
    
    let items = []

    for (const key in itensLS){
        if(key.includes('itemLista')){
            items.push(localStorage.getItem(key))
        }
    }

    items.push(itemLista)
    localStorage.setItem('itemLista', items)
}

function carregarNaListaOlocalStorage(){
    const itensLSStr = JSON.stringify(localStorage)
    const itensLS = JSON.parse(itensLSStr);

    for (const key in itensLS){
        if(key.includes('itemLista')){
            const itensLista = localStorage.getItem(key).split(',')
            itensLista.forEach(item => adicionarItemNaLista(item))
        }
    }
}