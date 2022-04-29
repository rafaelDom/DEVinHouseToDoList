var elementoSelecionadoLista = ""

function inserirItemLista(){
    const textInput = getTextInput();

    if(textInput == false){
        return
    }

    if(itemJaCadastrado(textInput)){
        alert('Item já cadastrado na lista!!!')
        return false
    } 

    if(!itemJaCadastrado(textInput)){
        addLocalStorage(textInput, valorItem)
        carregarNaListaOlocalStorage()
        carregarValorTotalDoLocalStorage()
        cleanInputText()
    }else{
        alert('Item já cadastrado na lista!!!')
        return false
    }
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
    itemLista.setAttribute('class','itemLista')
    const textItemList = document.createElement('span')
    const inputCheck = document.createElement('input')
    inputCheck.setAttribute('type','checkbox')
    inputCheck.setAttribute('class','itemComprado')
    inputCheck.setAttribute('onClick', 'marcarItemComoComprado(parentNode)')
    const deleteItem = document.createElement('i')
    deleteItem.setAttribute('class', 'fa fa-2x fas fa-times-circle')
    const buttonDelete = document.createElement('button')
    buttonDelete.setAttribute('onClick', 'excluirItem(parentNode)')
    buttonDelete.appendChild(deleteItem)
    textItemList.innerText = item['item']
    itemLista.appendChild(inputCheck)
    itemLista.appendChild(textItemList)
    itemLista.appendChild(buttonDelete)
    lista.appendChild(itemLista)

    if(Object.entries(item['valor']).length > 0){
        itemLista.style.textDecoration = "line-through";
        inputCheck.checked = true
    } 
    mostrarTotalDeItensLista()
}

function cleanInputText(){
    document.getElementById('itemLista').value = ''
    document.getElementById('valorItem').value = ''
    document.getElementById('itemLista').focus()
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
    document.getElementsByName('filtro')[0].checked = true
    document.getElementById('lista').innerHTML = '';
    if(localStorage.itemLista){
        const itemsLS = localStorage.getItem('itemLista')
        const items = JSON.parse(itemsLS)

        const itemLista = items.map( item => item)

        itemLista.forEach(item => {
            adicionarItemNaLista(item)
        });
        carregarValorTotalDoLocalStorage()
        mostrarTotalDeItensLista()
    }
}

function poupValorItem(){
  document.getElementById('popupValorItem').style.display = 'block'
  document.getElementById('lista').style.display = 'none'
  document.getElementById('valorItem').focus()
}

function closePopupValorItem(){
    document.getElementById('popupValorItem').style.display = 'none'
    document.getElementById('lista').style.display = 'block'
    carregarNaListaOlocalStorage()
    carregarValorTotalDoLocalStorage()
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
    const valorItem = getValorItem()

    if(!valorItem){
        return false
    }

    const item = elementoSelecionadoLista.innerText.trim()

    if(!gravarValorLocalStorage(item, valorItem)){
        return false
    }

    closePopupValorItem()
    document.getElementById('valorItem').value = ''
    document.getElementById('itemLista').focus()
   
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
        const itemExcluirFmt = itemExcluir.innerText.trim()

        if(localStorage.itemLista){
            const itemsLS = localStorage.getItem('itemLista')
            const items = JSON.parse(itemsLS)

            for (let index = 0; index < items.length; index++) {
                const element = items[index];
                if(element.item === itemExcluirFmt){
                    items.splice(index, 1);
                    localStorage.setItem('itemLista', JSON.stringify(items))
                    carregarNaListaOlocalStorage()
                    carregarValorTotalDoLocalStorage()
                    return true
                }
            }
        }
    } 
    return false
}

function marcarItemComoComprado(item){
    elementoSelecionadoLista = item
    poupValorItem()
}

function gravarValorLocalStorage(item, valor){
    if(localStorage.itemLista){
        const itemsLS = localStorage.getItem('itemLista')
        const items = JSON.parse(itemsLS)

        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            if(element.item === item){
                items[index].valor = valor
                localStorage.setItem('itemLista', JSON.stringify(items))
                carregarNaListaOlocalStorage()
                carregarValorTotalDoLocalStorage()
                return true
            }
        }
    }
    return false
}

function carregarValorTotalDoLocalStorage(){
    document.getElementById('valorTotalCompras').innerText = '';
    if(localStorage.itemLista){
        const itemsLS = localStorage.getItem('itemLista')
        const items = JSON.parse(itemsLS)

        const valorTotal = items.filter(item => Object.entries(item['valor']).length > 0)
                        .reduce((acc, item) => (parseFloat(acc) + parseFloat(item.valor)).toFixed(2), 0)

        document.getElementById('valorTotalCompras').innerText = `R$ ${valorTotal}`
        
    }
}

document.getElementById('itemLista').addEventListener('keydown', function (event) {
    if (event.key === "Enter"){
        inserirItemLista()
    }
})

document.getElementById('valorItem').addEventListener('keydown', function (event) {
    if (event.key === "Enter"){
        gravarValorItem()
    }
})

function carregarNaListaOsItemsCompradoslocalStorage(){
    document.getElementById('lista').innerHTML = '';
    if(localStorage.itemLista){
        const itemsLS = localStorage.getItem('itemLista')
        const items = JSON.parse(itemsLS)

        const itemLista = items.filter(item => Object.entries(item['valor']).length > 0)
                            .map( item => item)

        itemLista.forEach(item => {
            adicionarItemNaLista(item)
        });
        carregarValorTotalDoLocalStorage()
    }
}

function carregarNaListaOsItemsPendenteslocalStorage(){
    document.getElementById('lista').innerHTML = '';
    if(localStorage.itemLista){
        const itemsLS = localStorage.getItem('itemLista')
        const items = JSON.parse(itemsLS)

        const itemLista = items.filter(item => Object.entries(item['valor']).length <= 0)
                            .map( item => item)

        itemLista.forEach(item => {
            adicionarItemNaLista(item)
        });
        document.getElementById('valorTotalCompras').innerText = `R$ ${0}`
    }
}

function mostrarTotalDeItensLista(){
    if(localStorage.itemLista){
        const itemsLS = localStorage.getItem('itemLista')
        const items = JSON.parse(itemsLS)

        const totalItensLista = items.length

        document.getElementById('totalitensLista').innerText = `O total de itens cadastrados na lista é: ${totalItensLista}`
    }
}

function darkMode() {
    const isChecked = document.getElementById('darkModeBtn').checked
    const element = document.body;
    if(isChecked){
        element.className = "dark-mode";
    }else{
        element.className = "";
    }

  }