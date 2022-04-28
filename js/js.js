function inserirItemLista(){
    const textInput = getTextInput();

    if(textInput == false){
        return
    }

    if(itemJaCadastrado(textInput)){
        alert('Item já cadastrado na lista!!!')
        return false
    }

    poupValorItem() 
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
    buttonDelete.setAttribute('onClick', 'excluirItem(parentNode)')
    buttonDelete.appendChild(deleteItem)
    textItemList.innerText = item
    itemLista.appendChild(inputCheck)
    itemLista.appendChild(textItemList)
    itemLista.appendChild(buttonDelete)

    lista.appendChild(itemLista)

}

function cleanInputText(){
    document.getElementById('itemLista').value = ''
    document.getElementById('valorItem').value = ''
}

function addLocalStorage(item, valor){
    const lsItems = JSON.parse(localStorage.getItem('itemLista'))
    let itemsLS = localStorage.getItem('itemLista') !== null ? lsItems : []

    const objItem = {
        item: item,
        valor: valor
    }
    itemsLS.push(objItem)
    localStorage.setItem('itemLista', JSON.stringify(itemsLS))

}

function carregarNaListaOlocalStorage(){
    document.getElementById('lista').innerHTML = '';
    if(localStorage.itemLista){
        const itemsLS = localStorage.getItem('itemLista')
        const items = JSON.parse(itemsLS)

        const itemLista = items.map( item => item.item + ' | R$ ' + item.valor)

        itemLista.forEach(item => {
            adicionarItemNaLista(item)
        });
    }
}

function poupValorItem(){
  document.getElementById('popupValorItem').style.display = 'block'
  document.getElementById('lista').style.display = 'none'
}

function closePopupValorItem(){
    document.getElementById('popupValorItem').style.display = 'none'
    document.getElementById('lista').style.display = 'block'
}

function getValorItem(){
    const valorItem = document.getElementById('valorItem').value
    const regexp = new RegExp(/\d+,\d{2,}$/i);
    const isValor = regexp.test(valorItem);

    if(!isValor){
        alert('Valor inválido, favor inserir vírgula para as casa decimais. Exemplo 10,00');
        return false;
    }else{
        return valorItem
    }
}

function gravarValorItem(){

    const textInput = getTextInput();
    if(textInput == false){
        return false
    }

    if(!itemJaCadastrado(textInput)){
        const valorItem = getValorItem()

        if(!valorItem){
            return false
        }

        closePopupValorItem()

        adicionarItemNaLista(textInput + ' | R$ ' + valorItem)
        addLocalStorage(textInput, valorItem)

        cleanInputText()
    }else{
        alert('Item já cadastrado na lista!!!')
        return false
    }
}

function itemJaCadastrado(itemPesquisar){
    if(localStorage.itemLista){
        const itemsLS = localStorage.getItem('itemLista')
        const items = JSON.parse(itemsLS)

        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            if(element.item === itemPesquisar){
                return true
            }
        }
    }
    return false
}

function excluirItem(itemExcluir){
    if (confirm('Você deseja excluir o item: ' + itemExcluir.innerText + '?') == true) {
        const itemExcluirSplit = itemExcluir.innerText.split('|')
        const itemExcluirFmt = itemExcluirSplit[0].replace(/\s+/g, '')

        if(localStorage.itemLista){
            const itemsLS = localStorage.getItem('itemLista')
            const items = JSON.parse(itemsLS)

            for (let index = 0; index < items.length; index++) {
                const element = items[index];
                if(element.item === itemExcluirFmt){
                    items.splice(index, 1);
                    localStorage.setItem('itemLista', JSON.stringify(items))
                    carregarNaListaOlocalStorage()
                    return true
                }
            }
        }
    } 
    return false
}