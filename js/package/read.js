let GROUPS = []

window.onload = _ =>{ 
    
    start()
}

async function start(){
    if(isAdmin && !inGroup){ //dois helpers definidos no view
        await getGroups()
    
        buildForm()    
    }
}

function buildForm(){
    // group-list-wrapper
    let select_el = document.getElementById('field-add_group')
    
    
    GROUPS.forEach(group=>{
        let el = document.createElement('option')
        el.innerHTML = group
        select_el.append(el)
    })
}


async function getGroups(){
    let response
    try{
        response = await fetch('/dados/api/3/action/group_list')
        response = await response.json()
        GROUPS = response.result 
    } catch(e){
        console.log('Erro ao consultar lista de grupos');
    }     
}