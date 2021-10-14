
  var real_time=document.querySelector('.real_time')
  var week=document.querySelector('.seven_day')
  var type_order=document.querySelectorAll('.type_order')
  for (let i=0;i<type_order.length;i++){
    type_order[i].addEventListener('click',(e)=>{
      e.preventDefault();
      type_order[i].classList.add('type_order_choice')
      var url5 = new URL(window.location.href);
      var search_params5 = url5.searchParams;
      if(type_order[i].classList.contains('ordered')){
        search_params5.set('ordered', document.querySelector('.ordered.type_order_choice').getAttribute('value'));
        }
      else if(type_order[i].classList.contains('canceled')){
        search_params5.set('canceled', document.querySelector('.canceled.type_order_choice').getAttribute('value'));
      }
      else if(type_order[i].classList.contains('received')){
        search_params5.set('received', document.querySelector('.received.type_order_choice').getAttribute('value'));
      }
      
    if(real_time.classList.contains('time_choice')){
    search_params5.set('real_time', document.querySelector('.real_time.time_choice').getAttribute('value'));
    url5.search = search_params5.toString();
    var today = url5.toString();
    fetch(today, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
   
    })
    .then(response => response.json())
    .then(data => {
    
    let li =  `
                    <div>
                      <span>Revenue</span>
                    </div>
                    <div>
                      <span style="font-size: 1.3rem;" >$ ${data.result.amount_today_real}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>so voi Yesterday</span>
                      <span class="ml-3 result_amount"></span>
                    </div>
                 
                `
        let order=`
                  <div>
                    <span>Order</span>
                  </div>
                  <div>
                      <span style="font-size: 1.3rem;">${data.result.order_today_real}</span>
                  
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>so voi Yesterday</span>
                    <span class="ml-3 result"></span>
                  </div>
               
                `
          
        var chart =`<canvas id="lineChart"  style="display: block; height: 457px; width: 667px;"  class="chartjs-render-monitor"></canvas>`
        document.querySelector('.chartBox').innerHTML=chart
        document.getElementById('revenue').innerHTML=li
        document.querySelector('.chartBox').innerHTML=chart
        document.getElementById('order').innerHTML=order

          var yesterday=parseInt(data.result.amount_yesterday_real)
          var today= parseInt(data.result.amount_today_real)
          var result_amount=Math.round(parseFloat((today/yesterday)*100)-100)

          if(Number.isNaN(result_amount) === true || today >0 && yesterday === 0){
            document.querySelector('.result_amount').innerHTML='+ ' + today
          }
    
          else{
            document.querySelector('.result_amount').innerHTML=result_amount +' %'  
          }
    

          /* ----------------- order----------------- */
    
            var order_yesterday=parseInt(data.result.order_yesterday_real)
            
            var order_today= parseInt(data.result.order_today_real)
               
            var result=Math.round(parseFloat((order_today/order_yesterday)*100)-100)
            if(Number.isNaN(result) === true ){
              document.querySelector('.result').innerHTML='+' + order_today 
            }
            
            else{
              document.querySelector('.result').innerHTML=result+' %'
            }
    
          var labels=data.hours
          var total_amount_day =data.sum_hour
          var total_order_day = data.count_hour
          let draw = Chart.controllers.line.prototype.draw;
          var ctx = document.getElementById("lineChart").getContext("2d");
          var labels = labels
            
          Chart.defaults.global.legend.labels.usePointStyle = true;
          
          var data = {
            labels: labels,
            datasets: [
              {
                fill: false,
                label: "revenue",
                data: total_amount_day,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
              },
              {
                fill: false,
                label: "number order",
                data: total_order_day,
                borderColor: "rgb(80, 204, 168, 1)",
                backgroundColor: "rgb(80, 204, 168, 1)",
                
                borderWidth: 1
              },
            ],
          };
          
          var options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: 'top'
              ,
              align:'end'
            },
            layout: {
              padding: {
                left: 50,
                right: 50,
                top: 50,
                bottom: 50,
              },
            },
            scales: {
              x: {
                min: '0',
        
                type: 'time',
                time: {
                  unit: 'hour',
                  stepSize:1
              },
                
              },
              y: {
                  
                  min:0,
                  max:12000,
                  stepSize:1,
                  beginAtZero: true
              }
          },
            title: {
              display: true,
              text: "Total revenue today",
              fontFamily: "Raleway",
              fontColor: "#434a52",
              fontSize:20,
            },
            interaction: {
              mode: 'index',
              intersect: false
            }
          };
          
          var myChart = new Chart(ctx, {
            type: "line",
            backgroundColor: "red",
          
            data: data,
            options: options,
          });
    
    })
    .catch(error => console.error(error));

    }
    
    /*---------------------- yesterday-----------------------------------*/
    
    else if(document.querySelector('.yesterday').classList.contains('time_choice')){
      search_params5.set('yesterday', document.querySelector('.yesterday.time_choice').getAttribute('value'));
      url5.search = search_params5.toString();
      var yesterday = url5.toString();
      fetch(yesterday, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
     
      })
      .then(response => response.json())
      .then(data => {
      
      let li =  `
                      <div>
                        <span>Revenue</span>
                      </div>
                      <div>
                        <span style="font-size: 1.3rem;" >$ ${data.result.amount_yesterdays}</span>
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>so voi Yesterday</span>
                        <span class="ml-3 result_amount"></span>
                      </div>
                   
                  `
          var order=`
                    <div>
                      <span>Order</span>
                    </div>
                    <div>
                        <span style="font-size: 1.3rem;">${data.result.order_yesterdays}</span>
                    
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>so voi Yesterday</span>
                      <span class="ml-3 result"></span>
                    </div>
                 
                  `
            var chart =`<canvas id="lineChart"  style="display: block; height: 457px; width: 667px;"  class="chartjs-render-monitor"></canvas>`
            document.querySelector('.chartBox').innerHTML=chart
          document.getElementById('revenue').innerHTML=li
    
          document.getElementById('order').innerHTML=order

            var yesterday=parseInt(data.result.amount_before_yesterday_real)
            var today= parseInt(data.result.amount_yesterdays)
            var result_amount=Math.round(parseFloat((today/yesterday)*100)-100)

            if(Number.isNaN(result_amount) === true || today >0 && yesterday === 0){
              document.querySelector('.result_amount').innerHTML='+ ' + today
            }
      
            else{
              document.querySelector('.result_amount').innerHTML=result_amount +' %'
            }
  
            /* ------------------------------- order-------------------------------- */
      
              var order_yesterday=parseInt(data.result.order_before_yesterday_real)
              
              var order_today= parseInt(data.result.order_yesterdays)
                 
              var result=Math.round(parseFloat((order_today/order_yesterday)*100)-100)
              if(Number.isNaN(result) === true ){
                document.querySelector('.result').innerHTML='+' + order_today 
              }
              
              else{
                document.querySelector('.result').innerHTML=result+' %'
              }
      
            var labels=data.hours
            var total_amount_day =data.sum_hour
            var total_order_day = data.count_hour
            let draw = Chart.controllers.line.prototype.draw;
            
            var ctx = document.getElementById("lineChart").getContext("2d");
            var labels = labels
              
            
            Chart.defaults.global.legend.labels.usePointStyle = true;
            
            var data = {
              
              labels: labels,
              datasets: [
                {
                  fill: false,
                  label: "revenue",
                  data: total_amount_day,
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  borderWidth: 1
                },
                {
                  fill: false,
                  label: "number order",
                  data: total_order_day,
                  borderColor: "rgb(80, 204, 168, 1)",
                  backgroundColor: "rgb(80, 204, 168, 1)",
                  
                  borderWidth: 1
                },
              ],
            };
            
            var options = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                position: 'top'
                ,
                align:'end'
              },
              layout: {
                padding: {
                  left: 50,
                  right: 50,
                  top: 50,
                  bottom: 50,
                },
              },
              scales: {
                x: {
                  min: '0',
          
                  type: 'time',
                  time: {
                    unit: 'hour',
                    stepSize:1
                },
                  
                },
                y: {
                    
                    min:0,
                    max:12000,
                    stepSize:1,
                    beginAtZero: true
                }
            },
              title: {
                display: true,
                text: "Total revenue today",
                fontFamily: "Raleway",
                fontColor: "#434a52",
                fontSize:20,
              },
              interaction: {
                mode: 'index',
                intersect: false
              }
            };
            
            var myChart = new Chart(ctx, {
              type: "line",
              backgroundColor: "red",
            
              data: data,
              options: options,
            });
      
      })
      .catch(error => console.error(error));
  
      }

      /*---------------------------------------------seven day ago------------------------------------*/

      else if(document.querySelector('.seven_day').classList.contains('time_choice')){
        search_params5.set('week', document.querySelector('.seven_day.time_choice').getAttribute('value'));
        url5.search = search_params5.toString();
        var week = url5.toString();
        fetch(week, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
       
        })
        .then(response => response.json())
        .then(data => {
        
        let li =  `
                  <div>
                    <span>Revenue</span>
                  </div>
                  <div>    
                    <span style="font-size: 1.3rem;" >$ ${data.result.amount_week_real}</span> 
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Compare seven day ago</span>
                    <span class="ml-3 result_amount"></span>
                  </div>
                     
                `
        var order=`
                      <div>
                        <span>Order</span>
                      </div>
                      <div>
                          <span style="font-size: 1.3rem;">${data.result.order_week_real}</span>
                      
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Compare seven day ago</span>
                        <span class="ml-3 result"></span>
                      </div>
                   
                    `
              var chart =`<canvas id="lineChart"  style="display: block; height: 457px; width: 667px;"  class="chartjs-render-monitor"></canvas>`
              document.querySelector('.chartBox').innerHTML=chart
            document.getElementById('revenue').innerHTML=li
      
            document.getElementById('order').innerHTML=order
              var yesterday=parseInt(data.result.amount_lastweek_real)
            
              var today= parseInt(data.result.amount_week_real)
            
              var result_amount=Math.round(parseFloat((today/yesterday)*100)-100)
              if(Number.isNaN(result_amount) === true || today >0 && yesterday === 0){
                document.querySelector('.result_amount').innerHTML='+ ' + today
              }
        
              else{
                document.querySelector('.result_amount').innerHTML=result_amount +' %'
                
              }
        
    
              /* ----------------- order----------------- */
        
                var order_yesterday=parseInt(data.result.order_lastweek_real)
                
                var order_today= parseInt(data.result.order_week_real)
                   
                var result=Math.round(parseFloat((order_today/order_yesterday)*100)-100)
                if(Number.isNaN(result) === true ){
                  document.querySelector('.result').innerHTML='+' + order_today 
                }
                
                else{
                  document.querySelector('.result').innerHTML=result+' %'
                }
        
              var labels=data.day_weeks
              var total_amount_day =data.sum_day_week
              var total_order_day = data.count_day_week
              let draw = Chart.controllers.line.prototype.draw;
              
              var ctx = document.getElementById("lineChart").getContext("2d");
              var labels = labels
                
              
              Chart.defaults.global.legend.labels.usePointStyle = true;
              
              var data = {
                
                labels: labels,
                datasets: [
                  {
                    fill: false,
                    label: "revenue",
                    data: total_amount_day,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1
                  },
                  {
                    fill: false,
                    label: "number order",
                    data: total_order_day,
                    borderColor: "rgb(80, 204, 168, 1)",
                    backgroundColor: "rgb(80, 204, 168, 1)",
                    
                    borderWidth: 1
                  },
                ],
              };
              
              var options = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  position: 'top'
                  ,
                  align:'end'
                },
                layout: {
                  padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50,
                  },
                },
                scales: {
                  x: {
                    min: '0',
            
                    type: 'time',
                    time: {
                      unit: 'hour',
                      stepSize:1
                  },
                    
                  },
                  y: {
                      
                      min:0,
                      max:12000,
                      stepSize:1,
                      beginAtZero: true
                  }
              },
                title: {
                  display: true,
                  text: "Total revenue today",
                  fontFamily: "Raleway",
                  fontColor: "#434a52",
                  fontSize:20,
                },
                interaction: {
                  mode: 'index',
                  intersect: false
                }
              };
              
              var myChart = new Chart(ctx, {
                type: "line",
                backgroundColor: "red",
              
                data: data,
                options: options,
              });
        
        })
        .catch(error => console.error(error));
    
        }
  
         /*---------------------------------------------seven_day ago------------------------------------*/


        /*---------------------------------------------30 day ago------------------------------------*/

        else if(document.querySelector('.thirty_day').classList.contains('time_choice')){
          search_params5.set('month', document.querySelector('.thirty_day.time_choice').getAttribute('value'));
          url5.search = search_params5.toString();
          var month = url5.toString();
          fetch(month, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
         
          })
          .then(response => response.json())
          .then(data => {
          
          let li =  `
                          <div>
                            <span>Revenue</span>
                          </div>
                          <div>
                            
                            <span style="font-size: 1.3rem;" >$ ${data.result.amount_month_real}</span>
                           
                          </div>
                          <div class="d-flex justify-content-between">
                            <span>so voi Last month</span>
                            <span class="ml-3 result_amount"></span>
                          </div>
                       
                      `
              var order=`
                        <div>
                          <span>Order</span>
                        </div>
                        <div>
                            <span style="font-size: 1.3rem;">${data.result.order_month_real}</span>
                        
                        </div>
                        <div class="d-flex justify-content-between">
                          <span>Compare Last month</span>
                          <span class="ml-3 result"></span>
                        </div>
                     
                      `
                var chart =`<canvas id="lineChart"  style="display: block; height: 457px; width: 667px;"  class="chartjs-render-monitor"></canvas>`
                document.querySelector('.chartBox').innerHTML=chart
              document.getElementById('revenue').innerHTML=li
        
              document.getElementById('order').innerHTML=order
                var yesterday=parseInt(data.result.amount_lastmonth_real)
              
                var today= parseInt(data.result.amount_month_real)
              
                var result_amount=Math.round(parseFloat((today/yesterday)*100)-100)
                if(Number.isNaN(result_amount) === true || today >0 && yesterday === 0){
                  document.querySelector('.result_amount').innerHTML='+ ' + today
                }
          
                else{
                  document.querySelector('.result_amount').innerHTML=result_amount +' %'
                  
                }
          
      
                /* ----------------- order----------------- */
          
                  var order_yesterday=parseInt(data.result.order_lastmonth_real)
                  
                  var order_today= parseInt(data.result.order_month_real)
                     
                  var result=Math.round(parseFloat((order_today/order_yesterday)*100)-100)
                  if(Number.isNaN(result) === true ){
                    document.querySelector('.result').innerHTML='+' + order_today 
                  }
                  
                  else{
                    document.querySelector('.result').innerHTML=result+' %'
                  }
          
                var labels=data.day_months
                var total_amount_day =data.sum_day_month
                var total_order_day = data.count_day_month
                let draw = Chart.controllers.line.prototype.draw;
                
                var ctx = document.getElementById("lineChart").getContext("2d");
                var labels = labels
                  
                
                Chart.defaults.global.legend.labels.usePointStyle = true;
                
                var data = {
                  
                  labels: labels,
                  datasets: [
                    {
                      fill: false,
                      label: "revenue",
                      data: total_amount_day,
                      backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgb(255, 99, 132)',
                      borderWidth: 1
                    },
                    {
                      fill: false,
                      label: "number order",
                      data: total_order_day,
                      borderColor: "rgb(80, 204, 168, 1)",
                      backgroundColor: "rgb(80, 204, 168, 1)",
                      
                      borderWidth: 1
                    },
                  ],
                };
                
                var options = {
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: {
                    position: 'top'
                    ,
                    align:'end'
                  },
                  layout: {
                    padding: {
                      left: 50,
                      right: 50,
                      top: 50,
                      bottom: 50,
                    },
                  },
                  scales: {
                    x: {
                      min: '0',
              
                      type: 'time',
                      time: {
                        unit: 'hour',
                        stepSize:1
                    },
                      
                    },
                    y: {
                        
                        min:0,
                        max:12000,
                        stepSize:1,
                        beginAtZero: true
                    }
                },
                  title: {
                    display: true,
                    text: "Total revenue today",
                    fontFamily: "Raleway",
                    fontColor: "#434a52",
                    fontSize:20,
                  },
                  interaction: {
                    mode: 'index',
                    intersect: false
                  }
                };
                
                var myChart = new Chart(ctx, {
                  type: "line",
                  backgroundColor: "red",
                
                  data: data,
                  options: options,
                });
          
          })
          .catch(error => console.error(error));
      
          }
  
        /*---------------------------------------------30 day ago------------------------------------*/

        /*---------------------------------------------day------------------------------------------*/

    if(document.querySelector('.selected') !==null &&  document.querySelector('.selected') !==undefined){
      search_params5.set('day', document.querySelector('.selected').getAttribute('value'));
      url5.search = search_params5.toString();
      var day = url5.toString();
      fetch(day, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
     
      })
      .then(response => response.json())
      .then(data => {
      
      let li =  `
                      <div>
                        <span>Revenue</span>
                      </div>
                      <div>
                        
                        <span style="font-size: 1.3rem;" >$ ${data.result.amount_day}</span>
                       
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>so voi Yesterday</span>
                        <span class="ml-3 result_amount"></span>
                      </div>
                   
                  `
          var order=`
                    <div>
                      <span>Order</span>
                    </div>
                    <div>
                        <span style="font-size: 1.3rem;">${data.result.order_yesterday}</span>
                    
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>so voi Yesterday</span>
                      <span class="ml-3 result"></span>
                    </div>
                 
                  `
              var chart =`<canvas id="lineChart"  style="display: block; height: 457px; width: 667px;"  class="chartjs-render-monitor"></canvas>`
              document.querySelector('.chartBox').innerHTML=chart
            document.getElementById('revenue').innerHTML=li
    
            document.getElementById('order').innerHTML=order
            var yesterday=parseInt(data.result.amount_yesterday)
          
            var today= parseInt(data.result.amount_day)
          
            var result_amount=Math.round(parseFloat((today/yesterday)*100)-100)
            if(Number.isNaN(result_amount) === true || today >0 && yesterday === 0){
              document.querySelector('.result_amount').innerHTML='+ ' + today
            }
      
            else{
              document.querySelector('.result_amount').innerHTML=result_amount +' %'
              
            }
  
            /* ------------------------------ order----------------------------------------- */
      
              var order_yesterday=parseInt(data.result.order_yesterday)
              
              var order_today= parseInt(data.result.order_yesterday)
                 
              var result=Math.round(parseFloat((order_today/order_yesterday)*100)-100)
              if(Number.isNaN(result) === true ){
                document.querySelector('.result').innerHTML='+' + order_today 
              }
              
              else{
                document.querySelector('.result').innerHTML=result+' %'
              }
      
            var labels=data.hours
            var total_amount_day =data.sum_hour
            var total_order_day = data.count_hour
            let draw = Chart.controllers.line.prototype.draw;
            
            var ctx = document.getElementById("lineChart").getContext("2d");
            var labels = labels
              
            
            Chart.defaults.global.legend.labels.usePointStyle = true;
            
            var data = {
              
              labels: labels,
              datasets: [
                {
                  fill: false,
                  label: "revenue",
                  data: total_amount_day,
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  borderWidth: 1
                },
                {
                  fill: false,
                  label: "number order",
                  data: total_order_day,
                  borderColor: "rgb(80, 204, 168, 1)",
                  backgroundColor: "rgb(80, 204, 168, 1)",
                  
                  borderWidth: 1
                },
              ],
            };
            
            var options = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                position: 'top'
                ,
                align:'end'
              },
              layout: {
                padding: {
                  left: 50,
                  right: 50,
                  top: 50,
                  bottom: 50,
                },
              },
              scales: {
                x: {
                  min: '0',
          
                  type: 'time',
                  time: {
                    unit: 'hour',
                    stepSize:1
                },
                  
                },
                y: {
                    
                    min:0,
                    max:12000,
                    stepSize:1,
                    beginAtZero: true
                }
            },
              title: {
                display: true,
                text: "Total revenue today",
                fontFamily: "Raleway",
                fontColor: "#434a52",
                fontSize:20,
              },
              interaction: {
                mode: 'index',
                intersect: false
              }
            };
            
            var myChart = new Chart(ctx, {
              type: "line",
              backgroundColor: "red",
            
              data: data,
              options: options,
            });
      
            })
            .catch(error => console.error(error));
        }

        /*---------------------------------------------day------------------------------------*/


        /*---------------------------------------------week------------------------------------*/


        else if(document.querySelector('.week').classList.contains('time_choice')){
      search_params5.set('month', document.querySelector('.week.time_choice').getAttribute('value'));
      url5.search = search_params5.toString();
      var week = url5.toString();
      fetch(week, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
     
      })
      .then(response => response.json())
      .then(data => {
      
      let li =  `
                      <div>
                        <span>Revenue</span>
                      </div>
                      <div>
                        
                        <span style="font-size: 1.3rem;" >$ ${data.result.amount_week}</span>
                       
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Compare last week ago</span>
                        <span class="ml-3 result_amount"></span>
                      </div>
                   
                  `
          var order=`
                    <div>
                      <span>Order</span>
                    </div>
                    <div>
                        <span style="font-size: 1.3rem;">${data.result.order_week}</span>
                    
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Compare last week ago</span>
                      <span class="ml-3 result"></span>
                    </div>
                 
                  `
            var chart =`<canvas id="lineChart"  style="display: block; height: 457px; width: 667px;"  class="chartjs-render-monitor"></canvas>`
            document.querySelector('.chartBox').innerHTML=chart
          document.getElementById('revenue').innerHTML=li
    
          document.getElementById('order').innerHTML=order
            var yesterday=parseInt(data.result.amount_lastweek)
          
            var today= parseInt(data.result.amount_week)
          
            var result_amount=Math.round(parseFloat((today/yesterday)*100)-100)
            if(Number.isNaN(result_amount) === true || today >0 && yesterday === 0){
              document.querySelector('.result_amount').innerHTML='+ ' + today
            }
      
            else{
              document.querySelector('.result_amount').innerHTML=result_amount +' %'
              
            }
      
  
            /* ----------------- order----------------- */
      
              var order_yesterday=parseInt(data.result.order_lastweek)
              
              var order_today= parseInt(data.result.order_week)
                 
              var result=Math.round(parseFloat((order_today/order_yesterday)*100)-100)
              if(Number.isNaN(result) === true ){
                document.querySelector('.result').innerHTML='+' + order_today 
              }
              
              else{
                document.querySelector('.result').innerHTML=result+' %'
              }
      
            var labels=data.day_weeks
            var total_amount_day =data.sum_day_week
            var total_order_day = data.count_day_week
            let draw = Chart.controllers.line.prototype.draw;
            
            var ctx = document.getElementById("lineChart").getContext("2d");
            var labels = labels
              
            
            Chart.defaults.global.legend.labels.usePointStyle = true;
            
            var data = {
              
              labels: labels,
              datasets: [
                {
                  fill: false,
                  label: "revenue",
                  data: total_amount_day,
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  borderWidth: 1
                },
                {
                  fill: false,
                  label: "number order",
                  data: total_order_day,
                  borderColor: "rgb(80, 204, 168, 1)",
                  backgroundColor: "rgb(80, 204, 168, 1)",
                  
                  borderWidth: 1
                },
              ],
            };
            
            var options = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                position: 'top'
                ,
                align:'end'
              },
              layout: {
                padding: {
                  left: 50,
                  right: 50,
                  top: 50,
                  bottom: 50,
                },
              },
              scales: {
                x: {
                  min: '0',
          
                  type: 'time',
                  time: {
                    unit: 'hour',
                    stepSize:1
                },
                  
                },
                y: {
                    
                    min:0,
                    max:12000,
                    stepSize:1,
                    beginAtZero: true
                }
            },
              title: {
                display: true,
                text: "Total revenue today",
                fontFamily: "Raleway",
                fontColor: "#434a52",
                fontSize:20,
              },
              interaction: {
                mode: 'index',
                intersect: false
              }
            };
            
            var myChart = new Chart(ctx, {
              type: "line",
              backgroundColor: "red",
            
              data: data,
              options: options,
            });
      
      })
      .catch(error => console.error(error));
  
        }

        /*---------------------------------------------week------------------------------------*/

        /*---------------------------------------------month------------------------------------*/

        else if(document.querySelector('.month').classList.contains('time_choice')){
            search_params5.set('month', document.querySelector('.month.time_choice').getAttribute('value'));
            url5.search = search_params5.toString();
            var month = url5.toString();
            fetch(month, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
           
            })
            .then(response => response.json())
            .then(data => {
            
            let li =  `
                            <div>
                              <span>Revenue</span>
                            </div>
                            <div>
                              
                              <span style="font-size: 1.3rem;" >$ ${data.result.amount_month}</span>
                             
                            </div>
                            <div class="d-flex justify-content-between">
                              <span>Compare last month ago</span>
                              <span class="ml-3 result_amount"></span>
                            </div>
                         
                        `
                var order=`
                          <div>
                            <span>Order</span>
                          </div>
                          <div>
                              <span style="font-size: 1.3rem;">${data.result.order_month}</span>
                          
                          </div>
                          <div class="d-flex justify-content-between">
                            <span>Compare last month ago</span>
                            <span class="ml-3 result"></span>
                          </div>
                       
                        `
                  var chart =`<canvas id="lineChart"  style="display: block; height: 457px; width: 667px;"  class="chartjs-render-monitor"></canvas>`
                  document.querySelector('.chartBox').innerHTML=chart
                document.getElementById('revenue').innerHTML=li
          
                document.getElementById('order').innerHTML=order
                  var yesterday=parseInt(data.result.amount_lastmonth)
                
                  var today= parseInt(data.result.amount_month)
                
                  var result_amount=Math.round(parseFloat((today/yesterday)*100)-100)
                  if(Number.isNaN(result_amount) === true || today >0 && yesterday === 0){
                    document.querySelector('.result_amount').innerHTML='+ ' + today
                  }
            
                  else{
                    document.querySelector('.result_amount').innerHTML=result_amount +' %'
                    
                  }
            
        
                  /* ----------------- order----------------- */
            
                    var order_yesterday=parseInt(data.result.order_lastmonth)
                    
                    var order_today= parseInt(data.result.order_month)
                       
                    var result=Math.round(parseFloat((order_today/order_yesterday)*100)-100)
                    if(Number.isNaN(result) === true ){
                      document.querySelector('.result').innerHTML='+' + order_today 
                    }
                    
                    else{
                      document.querySelector('.result').innerHTML=result+' %'
                    }
            
                  var labels=data.day_months
                  var total_amount_day =data.sum_day_month
                  var total_order_day = data.count_day_month
                  let draw = Chart.controllers.line.prototype.draw;
                  
                  var ctx = document.getElementById("lineChart").getContext("2d");
                  var labels = labels
                    
                  
                  Chart.defaults.global.legend.labels.usePointStyle = true;
                  
                  var data = {
                    
                    labels: labels,
                    datasets: [
                      {
                        fill: false,
                        label: "revenue",
                        data: total_amount_day,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1
                      },
                      {
                        fill: false,
                        label: "number order",
                        data: total_order_day,
                        borderColor: "rgb(80, 204, 168, 1)",
                        backgroundColor: "rgb(80, 204, 168, 1)",
                        
                        borderWidth: 1
                      },
                    ],
                  };
                  
                  var options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                      position: 'top'
                      ,
                      align:'end'
                    },
                    layout: {
                      padding: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50,
                      },
                    },
                    scales: {
                      x: {
                        min: '0',
                
                        type: 'time',
                        time: {
                          unit: 'hour',
                          stepSize:1
                      },
                        
                      },
                      y: {
                          
                          min:0,
                          max:12000,
                          stepSize:1,
                          beginAtZero: true
                      }
                  },
                    title: {
                      display: true,
                      text: "Total revenue today",
                      fontFamily: "Raleway",
                      fontColor: "#434a52",
                      fontSize:20,
                    },
                    interaction: {
                      mode: 'index',
                      intersect: false
                    }
                  };
                  
                  var myChart = new Chart(ctx, {
                    type: "line",
                    backgroundColor: "red",
                  
                    data: data,
                    options: options,
                  });
            
            })
            .catch(error => console.error(error));
        
            }
            
        /*---------------------------------------------month------------------------------------*/

        for (let j=0;j<type_order.length;j++){
        if(j!==i){
            type_order[j].classList.remove('type_order_choice')
        }
        }
    })
  }


  var time_choice=document.querySelectorAll('.time_order')
  for (let i=0;i<time_choice.length;i++){
    time_choice[i].addEventListener('click',(e)=>{
      e.preventDefault();
      time_choice[i].classList.add('time_choice')
      for (let j=0;j<time_choice.length;j++){
        if(j!==i){
          time_choice[j].classList.remove('time_choice')
        }
      }
    })
  }


/* --------------------------------- today---------------------------------------*/


  var url = new URL(window.location.href);
  var search_params = url.searchParams;
  search_params.set('real_time', document.querySelector('.time_choice').getAttribute('value'));
  if(document.querySelector('.ordered.type_order_choice') !==null && document.querySelector('.type_order_choice') !==undefined){
  search_params.set('ordered', document.querySelector('.ordered.type_order_choice').getAttribute('value'));
  }
  if(document.querySelector('.canceled.type_order_choice') !==null && document.querySelector('.type_order_choice') !==undefined){
  search_params.set('canceled', document.querySelector('.canceled.type_order_choice').getAttribute('value'));
}
if(document.querySelector('.received.type_order_choice') !==null && document.querySelector('.type_order_choice') !==undefined){
  search_params.set('received', document.querySelector('.received.type_order_choice').getAttribute('value'));
}
  url.search = search_params.toString();
  var today = url.toString();
  fetch(today, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
   
    })
    .then(response => response.json())
    .then(data => {
    console.log(data)
    let li =  `
                    <div>
                      <span>Revenue</span>
                    </div>
                    <div>
                     
                      <span style="font-size: 1.3rem;" >$ ${data.result.amount_today_real}</span>
                     
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>so voi Yesterday</span>
                      <span class="ml-3 result_amount"></span>
                    </div>
                 
                `
        var order=`
                  <div>
                    <span>Order</span>
                  </div>
                  <div>
                      <span style="font-size: 1.3rem;">${data.result.order_today_real}</span>
                  
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>so voi Yesterday</span>
                    <span class="ml-3 result"></span>
                  </div>
               
                `
        document.getElementById('revenue').innerHTML=li
  
        document.getElementById('order').innerHTML=order

          var yesterday_amount=parseInt(data.result.amount_yesterday_real)
         
          var today_amount= parseInt(data.result.amount_today_real)
         
         
          var result_amount=Math.round(parseFloat((today_amount/yesterday_amount)*100)-100)
          if(Number.isNaN(result_amount) === true || (today_amount == 0 && yesterday_amount == 0)){
            document.querySelector('.result_amount').innerHTML='+ ' + today_amount
            console.log('J'+result_amount)
          }
    
          else{
            
            document.querySelector('.result_amount').innerHTML=result_amount +' %'
            console.log('K' +result_amount)
          }
    
    
              /*  order */
          
            var order_yesterday=parseInt(data.result.order_yesterday_real)
        
            var order_today= parseInt(data.result.order_today_real)
               
            var result=Math.round(parseFloat((order_today/order_yesterday)*100)-100)
            if(Number.isNaN(result) === true ){
              document.querySelector('.result').innerHTML='+' + order_today 
            }
            
            else{
              document.querySelector('.result').innerHTML=result+' %'
            }
    
          var labels=data.hours
          var total_amount_day =data.sum_hour
          var total_order_day = data.count_hour
          let draw = Chart.controllers.line.prototype.draw;
          var ctx = document.getElementById("lineChart").getContext("2d");
          var labels = labels
            
          Chart.defaults.global.legend.labels.usePointStyle = true;
          
          var data = {
            
            labels: labels,
            datasets: [
              {
                fill: false,
                label: "revenue",
                data: total_amount_day,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
              },
              {
                fill: false,
                label: "number order",
                data: total_order_day,
                borderColor: "rgb(80, 204, 168, 1)",
                backgroundColor: "rgb(80, 204, 168, 1)",
                
                borderWidth: 1
              },
            ],
          };
          
          var options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: 'top'
              ,
              align:'end'
            },
            layout: {
              padding: {
                left: 50,
                right: 50,
                top: 50,
                bottom: 50,
              },
            },
            scales: {
              x: {
                min: '0',
        
                type: 'time',
                time: {
                  unit: 'hour',
                  stepSize:1
              },
                
              },
              y: {
                  
                  min:0,
                  max:12000,
                  stepSize:1,
                  beginAtZero: true
              }
          },
            title: {
              display: true,
              text: "Total revenue today",
              fontFamily: "Raleway",
              fontColor: "#434a52",
              fontSize:20,
            },
            interaction: {
              mode: 'index',
              intersect: false
            }
          };
          
          var myChart = new Chart(ctx, {
            type: "line",
            backgroundColor: "red",
          
            data: data,
            options: options,
          });
    
    })
    .catch(error => console.error(error));

  