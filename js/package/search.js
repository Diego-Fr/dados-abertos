let DATASETS = []
let LIMIT = 4
let TOTAL_SIZE = 0
let PAGE_NUMBER = 1
let TOTAL_PAGES = 1
let pagination_items = []

let LEFT_CONTROL = document.querySelector('.control[data-id="left"]')
let RIGHT_CONTROL = document.querySelector('.control[data-id="right"]')

loadSkeleton()

window.onload = _ =>{
    start()

    

    LEFT_CONTROL.addEventListener('click', _=>{
        if(PAGE_NUMBER != 1){
            PAGE_NUMBER -= 1
            getDatasets()
        }
        updatePagination()
    })

    RIGHT_CONTROL.addEventListener('click', _=>{
        if(PAGE_NUMBER != TOTAL_PAGES){
            PAGE_NUMBER += 1
            getDatasets()
        
        }
        updatePagination()
        
    })

    let main_input = document.getElementById('main-input')
    
    main_input.addEventListener('keydown', e=>{
        
        if (e.key === 'Enter') {
            console.log('Enter pressionado! Valor:', main_input.value);
            reloadPage(main_input.value)
          }
        
    })

}

function updatePagination(){
    let item = document.querySelector('.item.active')

    item.classList.remove('active')

    pagination_items[PAGE_NUMBER-1].classList.add('active')


}


async function start(){
    let urlSearchParams = new URLSearchParams(document.location.search)
    // PAGE_NUMBER = urlSearchParams.get('page') ?  parseInt(urlSearchParams.get('page')) : 1
    
    await getDatasets()
    pagination()
}

function loadSkeleton(){
    let container = document.getElementsByClassName('search-list-container')[0].getElementsByClassName('list')[0]
    for(let i = 1; i <= 10; i++){
        let el = document.createElement('div')
        el.classList.add('skeleton-div')

        container.appendChild(el)
    }
}

function pagination(){ 
    let container = document.querySelector('.search-list-container .pagination .items')
    
    if(DATASETS.length > 0){
        TOTAL_PAGES = Math.ceil(TOTAL_SIZE / LIMIT)

        for(let i = 1; i<= (TOTAL_PAGES > 10 ? 10 : TOTAL_PAGES); i++){
            
            let el = document.createElement('div')
            el.classList.add(`item`)
            
            if(i === 1){                
                if(!PAGE_NUMBER || PAGE_NUMBER === 1){                    
                    el.classList.add(`active`)
                }
            } else if(i === parseInt(PAGE_NUMBER)){
                el.classList.add('active')
            }
            
            el.innerHTML = i
            
            container.append(el)

            el.addEventListener('click', _=>{
                if(PAGE_NUMBER != i){
                    PAGE_NUMBER = i
                    getDatasets()
                    updatePagination()
                }
                
            })

            pagination_items.push(el)
        }
    }
}

function reloadPage(q){
    const params = new URLSearchParams(window.location.search);
    
    params.set('q', q);

    window.location = `${window.location.pathname}?${params.toString()}`;
}

async function getDatasets(){
    
    let response
    try{
        response= await fetch(mountUrl())
        response = await response.json()
    } catch(e){
        console.log(e);
        
        console.log('Erro ao consultar packages');
    }

    DATASETS = []
    TOTAL_SIZE = null

    if(response && response.result && Array.isArray(response.result.results)){
        DATASETS = response.result.results
        TOTAL_SIZE = response.result.count
    } else if(response && Array.isArray(response.result)){
        DATASETS = response.result
        // TOTAL_SIZE = response.result.num_resources
    }

    let container = document.getElementsByClassName('search-list-container')[0].getElementsByClassName('list')[0]

    container.innerHTML = ''
    DATASETS.forEach(dataset=>{
        console.log(dataset);
        
        let el = document.createElement('div')
        el.classList.add('list-item-container')
        el.innerHTML = `
            
            <div class="title">
                <a href="/dataset/${dataset.name}">${dataset.title}</a>${dataset.private ? '<span class="custombadge bg-danger">privado</span>' : ''}
            </div>
            <div class="subtitle">${dataset.type}</div>
            <div class='description mb-3'>${dataset.notes}</div>
            <div class="footer-container">
                <div class='tags'>
                    ${dataset.tags.map(x=> `<span>${x.name}</span>`).join('')}
                </div>
                <div class='updated_at'>Última atualização: 14/02/2025 10:00</div>
            </div>
            
        `
        container.appendChild(el) 

        setTimeout(_=>{
            el.classList.add('show')
        },10)
    })

    updateTotalSize()
    
}

function updateTotalSize(){
    let el = document.querySelector('.right-wrapper number')
    el.innerHTML = TOTAL_SIZE
}

function mountUrl(){
    let urlSearchParams = new URLSearchParams(document.location.search)

    let fq = ''
    let not_fq = ['q', 'page', 'rows']

    Array.from(urlSearchParams.keys()).map(key=>{
        // fq = ''
        if(!not_fq.includes(key)){
            urlSearchParams.getAll(key).map(value =>{
                fq += `+${key}:${value} `
            })
            
        }
        
    })

    not_fq.forEach(key=>{
        if(urlSearchParams.get(key)){

        }
    })
    if(!GROUP){
        
        return `/api/3/action/package_search?include_private=${isAdmin}&rows=${LIMIT}&q=${urlSearchParams.get('q') || ''}&fq=${fq}&start=${PAGE_NUMBER*LIMIT - LIMIT}`
    } else {
        return `/api/3/action/package_search?include_private=${isAdmin}&rows=${LIMIT}&q=${urlSearchParams.get('q') || ''}&fq=${fq} +groups:${GROUP.toLowerCase()}&start=${PAGE_NUMBER*LIMIT - LIMIT}`
        // return `/api/3/action/group_package_show?id=${GROUP.toLowerCase()}&include_private=${isAdmin}&rows=${LIMIT}&q=${urlSearchParams.get('q') || ''}&fq=${fq}&start=${PAGE_NUMBER*LIMIT - LIMIT}`
    }
    
}