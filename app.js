//BUDGET CONTROLLER
var budgetController=(function()   
{
    
    var Expense=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    
    Expense.prototype.calcPercentage= function(totalIncome)
    {
        
        if(totalIncome>0)
            {
      this.percentage=Math.round((this.value/totalIncome)*100);          
            }
        
        else
        {
            this.percentage=-1;
        }
        
    };
    
    Expense.prototype.getPercentage= function()
    {
      return this.percentage;  
    };
    
    var Income=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var calculateTotal=function(type)
    {
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        
        data.totals[type]=sum;
    }
    
    var data={
    allItems: {
        exp:[],
        inc:[]
    },
        totals: {
            exp:0,
            inc:0
        },
        
        budget: 0,
        
        percentage: -1
    }
    
    return {
      addItem: function(type,des,val)
        {
            var newItem,ID;
            //[1,2,3,4,5] next ID=6
            //[1,2,4,6,8] next ID=9
            //ID= lastID + 1
            
            //create new ID
            if(data.allItems[type].length>0)
                {
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
                }
            else
                {
                    ID=0;
                }
            
            //Create new item based on 'exp' or 'inc type
            if(type==='exp')
                {
            newItem=new Expense(ID,des,val);
                }
            else if(type==='inc')
                {
                    newItem=new Income(ID,des,val);
                }
            
            //Push it into our data structure
            data.allItems[type].push(newItem);
            
            //Return the new element
            return newItem;
        },
        
        deleteItem: function(type,id)
        {
          var ids,index;
        
            ids=data.allItems[type].map(function(current)
                                           {
                return current.id;
            });
            
            index=ids.indexOf(id);
            
            if(index!==-1)
                {
                    data.allItems[type].splice(index,1);
                }
        },
        
        calculateBudget: function()
        {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            
            //calculate the budget: income-expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            
            //calculate the percentage of income that we spent
            
            if(data.totals.inc>0)
                {
            data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
                }
            
            else
                {
                    data.percentage=-1;
                }
            
            
        },
        
        calculatePercentages: function()
        {
            
            data.allItems.exp.forEach(function(cur)
                                     {
                return cur.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function()
        {
            var allPerc=data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        getBudget: function(){
           return {
            budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage: data.percentage
           };
        },
        
        testing: function()
        {
            console.log(data);
        }
            
        
    };
})();

var Expense=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
    };
    




//UI CONTROLLER
var uiController=(function(){
    
    var domStrings={
      inputType:  '.add__type',
        inputDescription:'.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    
    var formatNumber=function(num,type)
        {
        var numSplit,int,dec;
            num=Math.abs(num);
            num=num.toFixed(2);
            numSplit=num.split('.');
            
            int=numSplit[0];
            if(int.length>3)
                {
                    int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
                }
            
            dec=numSplit[1];
            
            return (type === 'exp' ? '-' : '+')+' '+int+'.'+dec;
        };
    
    var nodeListForEach=function(list,callback)
            {
               for(var i=0;i<list.length;i++)
                   {
                       callback(list[i],i);
                   }
            };
            
        
    return{
      getInput:function(){
            return{
            type: document.querySelector(domStrings.inputType).value,
            description: document.querySelector(domStrings.inputDescription).value,
            value: parseFloat(document.querySelector(domStrings.inputValue).value)
            };
        },
        
        
        addListItem: function(obj,type)
        {
            var html,newHtml,element;
         //1. Create HTML string with placeholder text
            if(type==='inc')
                {
                    element=domStrings.incomeContainer;
html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                        
                }
                    else if(type==='exp')
                        {
                            element=domStrings.expensesContainer;
html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                        }
            
         //2. Replace the placeholder text with some actual data
            
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
         //3. Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        
        deleteListItem: function(selectorId)
        {
            var el=document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function()
        {
            var fields,fieldsArr;
        fields=document.querySelectorAll(domStrings.inputDescription+','+domStrings.inputValue); 
            
        fieldsArr=Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current,index,array)
                             {
               current.value=""; 
            });
            
            fieldsArr[0].focus();
        },
    
        displayBudget: function(obj)
        {
            var type;
            obj.budget>0?type='inc':type='exp';
            
    document.querySelector(domStrings.budgetLabel).textContent=formatNumber(obj.budget,type);
    document.querySelector(domStrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
    document.querySelector(domStrings.expensesLabel).textContent=formatNumber(obj.totalExp,'exp');        
            if(obj.percentage>0)
                {
        document.querySelector(domStrings.percentageLabel).textContent=obj.percentage+'%';
                }
            else
                {
        document.querySelector(domStrings.percentageLabel).textContent='---';
                }
        },
        
        displayPercentages: function(percentages)
        {
           var fields=document.querySelectorAll(domStrings.expensesPercLabel);
            
            nodeListForEach(fields,function(current,index){
                
                if(percentages[index]>0)
                    {
                current.textContent=percentages[index]+'%';        
                    }
                
                else
                    {
                        current.textContent='---'; 
                    }
                
            });
        },
            
        
        displayMonth: function()
        {
          
            var now,months,month,year;
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            now=new Date();
            month=now.getMonth();
            year=now.getFullYear();
            document.querySelector(domStrings.dateLabel).textContent=months[month]+' '+year;
        },
        
        
        changedType: function()
        {
var
fields=document.querySelectorAll(domStrings.inputType+','+domStrings.inputDescription+','+domStrings.inputValue);
            
            nodeListForEach(fields,function(cur)
                           {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(domStrings.inputBtn).classList.toggle('red');
    },
        
        getDomStrings: function()
    {
        return domStrings;
    }
        
    };
    
    
})();




//GLOBAL APP CONTROLLER
var controller=(function(budgetCtrl,uiCtrl)
{
    
    var setupEventListeners=function()
    {
        var dom=uiCtrl.getDomStrings();

     document.querySelector(dom.inputBtn).addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress',function(event)
    {
         if(event.keycode===13||event.which===13)
             {
                 ctrlAddItem();
             }
        
        
    }); 
        
        document.querySelector(dom.container).addEventListener('click',ctrlDeleteItem);
        
        document.querySelector(dom.inputType).addEventListener('change',uiCtrl.changedType);
    };
        
    var updateBudget=function()
    {
    
      //5. Calculate the budget.
      budgetCtrl.calculateBudget();
        
        
      //6. Return the budget.
        var budget=budgetCtrl.getBudget();
        
      //7. Display the budget on the UI.
        uiCtrl.displayBudget(budget);
    };
    
    var updatePercentages=function()
    {
      
        //1. Calculate Percentages
        budgetCtrl.calculatePercentages();
        
        //2. Read the percentages from the budget controller
        var percentages=budgetCtrl.getPercentages();
        
        
        //3. Update the UI with new percentages
        uiCtrl.displayPercentages(percentages);
    };
    
    var ctrlAddItem=function()
    {
        var input,newItem;
        
        //1. Get the field input data.
         input=uiCtrl.getInput();
            console.log(input);
        
        if(input.description!=="" && (!isNaN(input.value)) && (input.value>0))
        {
        //2. Add the item to the budget controller.
        newItem=budgetCtrl.addItem(input.type,input.description,input.value);
        
        //3. Add the item to the UI.
        uiCtrl.addListItem(newItem,input.type);
        
        //4. Clear the fields
        uiCtrl.clearFields();
         
        //5. Calculate and Update the Budget.
        updateBudget(); 
            
        //6. Calculate and Update Percentages
            updatePercentages();
            
        }
    };
    
    var ctrlDeleteItem=function(event)
    {
        var ItemId,splitId,type,id;
        
       itemId=(event.target.parentNode.parentNode.parentNode.parentNode.id);  
        
        if(itemId)
            {
                splitId=itemId.split('-');
                type=splitId[0];
                id=parseInt(splitId[1]);
                
                //1. Delete the item from data model
                budgetCtrl.deleteItem(type,id);
                
                
                //2. Delete the item from UI
                uiCtrl.deleteListItem(itemId);
                
                
                //3.Update and show the new Budget
                updateBudget();
                
                
                //4. Calculate and Update Percentages
                updatePercentages();
            }
    };
    
    return {
        init: function() {
            console.log('Application has started');
            uiCtrl.displayMonth();
            uiCtrl.displayBudget({
            budget: 0,
               totalInc: 0,
               totalExp: 0,
               percentage: -1
           });
            setupEventListeners();
        }
    };
    
})(budgetController,uiController);

controller.init();