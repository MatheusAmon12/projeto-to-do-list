const Main = {//obejeto principal que controla a Lista de Tarefas

    tasks: [],

    init: function(){//inicia todo processo
        this.cacheSelectors()//o this, nesse contexto, referencia o Main, ou seja, aqui ele procura o cacheSelectors no Main.
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    cacheSelectors: function(){//selecionar elementos HTML e armazená-los
        this.$checkButtons = document.querySelectorAll('.check')//o this aqui está adcionando a variável no Main, assim posso usá-la em qualquer parte do Main. Padronizei com $ os elementos HTML
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')

    },

    bindEvents: function(){//adicionar eventos aos elementos HTML
        const self = this//aqui o this ainda referencia o Main, então atibuí a uma constante para poder ser usado dentro do forEach
        this.$checkButtons.forEach(function(button){
            button.onclick = self.Events.checkButton_click
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)//Aqui com bind(this) estou ligando o this com referência do Main à minha função
        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self)//trazendo o this para esta função, pois o escopo é diferente
        })
    },

    getStoraged: function(){
        const tasks = localStorage.getItem('tasks')

        this.tasks = JSON.parse(tasks) //o this.tasks não tem relação com o tasks, devido ao escopo
    },

    getTaskHtml: function(task){
        return `
            <li>
                <div class="check"></div>
                <label for="" class="task">
                    ${task}
                </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
    },

    buildTasks: function(){
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html

        this.cacheSelectors()//estou chamando novamente essas funções para corrigir o bug de não ser possível marcar e excluir as tarefas. Aqui os elementos já foram inseridos na tela, então já capturo eles e insiro os eventos.
        this.bindEvents()
    },

    Events: {
        checkButton_click: function(e){
            const li = e.target.parentElement
            const isDone = li.classList.contains('done')

            /*if (isDone){
                li.classList.remove('done')
            } else{
                li.classList.add('done')
            }*///Funciona normalmente, mas abaixo farei algo que é uma boa prática

            if (!isDone){
                return li.classList.add('done')//É uma boa prática primeiro verificar a negação de uma variável, no caso aqui eu retorno a adição da classe done caso o valor seja False. Com o return eu impeço que o código execute a linha 34. 
            }

            li.classList.remove('done')
        },

        inputTask_keypress: function(e){
            //console.log(this) Dentro de um evento o this será o próprio elemento HTML selecioando para adicionar o evento

            const key = e.key //capturando a tecla apertada
            const value = e.target.value //capturando o valor digitado no input

            if (key === 'Enter'){
                this.$list.innerHTML += this.getTaskHtml(value)

                e.target.value = ''

                //Quando inserimos mais conteúdo no HTML a árvore dele é modificado, o navegador tem que renderizar tudo novamente. Então os elementos HTML perdem a referência dos eventos que foram adicionados. Sendo assim chamei as funções responsáveis novamente. Está aí a importância de dividir e organizar bem o código.
                this.cacheSelectors()
                this.bindEvents()

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksObj = JSON.parse(savedTasks)

                const obj = [
                    {task: value},
                    ...savedTasksObj,//spread operator, utilizado em arrays. Ele joga na array a variável savedTasksObj que contém itens de uma array dentro de obj
                ]
                localStorage.setItem('tasks', JSON.stringify(obj))
            }           
        },

        removeButton_click: function(e){
            const li = e.target.parentElement
            const value = e.target.dataset['task']

            const newTaksState = this.tasks.filter(item => item.task !== value)

            console.log(newTaksState)

            localStorage.setItem('tasks', JSON.stringify(newTaksState))

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            }, 300)
        }
    }
}

Main.init()