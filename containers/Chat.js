import axios from 'axios';
import React, {useState, useEffect,memo,useRef,Component} from 'react'
import {localhost,formatter,threadlURL,listThreadlURL,updatefileURL,dataURLtoFile,checkDay,itemvariation,timeformat,timevalue} from "../constants"

import { connect } from 'react-redux';
import { checkAuthenticated } from '../actions/auth';
import PropTypes from 'prop-types';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import emoji from 'emoji-mart/dist/components/emoji/emoji';
import data from 'emoji-mart/data/facebook.json'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Detailview from "./Detailview"
import ReactDOM from 'react-dom'
const Message=({show_thread,threads,listMessages,show_message,thread_choice})=>{
    const [state, setState] = useState({list_messages:[],user:null,errow:true,count_unread:0,typing:false,
    list_file_chat:[],time_out:0,show_product:false,show_order:false,show_chat:false});
    const [show, setShow] = useState(false);
    const [shop,setShop]=useState({list_orders:[],list_items:[],count_product:0,count_order:0,choice:null})
    const [list_messages,setListmessages]=useState([]);
    const [message,setMessage]=useState({message:'',item_id:0,order_id:0,sent_by:null,
    thread_choice:null,
    uploadfile_id:0,list_uploadfile:[]})
    const [list_threads,setThreads]=useState(null);
    const [showemoji,setShowemoji]=useState(false)
    const socket=useRef()   
    const scrollRef=useRef(null);
    useEffect(() => { 
        socket.current = new W3CWebSocket('wss://anhdai.herokuapp.com/' + '/')
        socket.current.onopen = () => {
            console.log('WebSocket Client Connected');
          };
    },[])

    useEffect(() => { 
        if(show_thread!=undefined){
            setShow(show_thread)
            setListmessages(listMessages)
            setThreads(threads)
            setMessage({...message,thread_choice:thread_choice})
            setState({...state,show_chat:show_message})
        }
       
        
    },[show_thread,threads,listMessages,show_message,thread_choice])

    useEffect(() => { 
        setTimeout(function(){
            if(show_message){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight 
            }
        },10)
    
    },[show_message,scrollRef.current])

    useEffect(() => { 
        socket.current.onmessage=(e)=>{
            const data = JSON.parse(e.data)
            console.log(data)
            if(data.typing==null){
            const list=[...list_messages,{sender:data.sender,text:data.message,list_file:data.list_uploadfile,message_order:data.order,message_product:data.product,created:timevalue(new Date())}]
            setListmessages(list)
            setState({...state,list_file_chat:[],typing:false})
            }
            else{
                if(data.typing.length>1){
                    setState({...state,typing:false,send_to:data.send_to})
                }
                else{
                    setState({...state,typing:true,send_to:data.send_to})
                }
            }
            
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
        
    },[list_messages])

    useEffect(() =>  {
        if(localStorage.token!='undefined'){
            const getJournal = async () => {
                await axios.get(threadlURL,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
                .then(res=>{
                    setState({...state,loading:true,errow:false,user:res.data.user,count_unread:res.data.threads.filter(thread=> thread.message.length>0 && !thread.message[0].read && thread.message[0].sender!=res.data.user.username)})
                })   
            }
            getJournal() 
        }
    }, []);

    
    const showthread=()=>{
        setShow(true)
        axios.get(listThreadlURL,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
        .then(res=>{
            setState({...state,loading:true})
            setThreads(res.data.threads)
        })
    }

    const showmessage=(threadchoice)=>{
        setState({...state,loading:false})
        if(threadchoice.count_message_not_seen>0 && threadchoice.message[0].sender!=state.user.username){ 
            const list_thread=list_threads.map(thread=>{
                if(thread.id==threadchoice.id){
                    return({...thread,count_message_not_seen:0})
                }
                return({...thread})
            })
            setThreads(list_thread)
            let form=new FormData()
            form.append('thread_id',threadchoice.id)
            form.append('seen',true)
            axios.post(listThreadlURL,form,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
            .then(res=>{
                setState({...state,loading:true,show_chat:true})
                setListmessages(res.data.messages)
                setMessage({...message,thread_choice:threadchoice})
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            })
        }
        else{
            let url= new URL(listThreadlURL)
            let search_params=url.searchParams
            search_params.set('thread_id',threadchoice.id)
            url.search = search_params.toString();
            let new_url = url.toString();
            axios.get(new_url,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
            .then(res=>{
                setState({...state,loading:true,show_chat:true})
                setListmessages(res.data.messages)
                setMessage({...message,thread_choice:threadchoice})
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            })
        }
        
    }

    const sendproduct=(item)=>{
        let data = {
            item_id:item.item_id,
            order_id:0,
            item:item,
            order:{},
            sent_by: state.user.user_id,
            send_to: parseInt(`${message.thread_choice.info_thread.find(user=>user.user_id!==state.user.user_id).user_id}`),
            thread_id:message.thread_choice.id,
            count_uploadfile: state.list_file_chat.length,
            list_uploadfile:[]
        }
        data = JSON.stringify(data)
        socket.current.send(data)
    }

    const sendorder=(order)=>{
        let data = {
            item_id:0,
            product:{},
            order:order,
            order_id:order.id,
            sent_by: state.user.user_id,
            send_to: parseInt(`${message.thread_choice.info_thread.find(user=>user.user_id!==state.user.user_id).user_id}`),
            thread_id:message.thread_choice.id,
            count_uploadfile: state.list_file_chat.length,
            list_uploadfile:[]
            
        }
        data = JSON.stringify(data)
        socket.current.send(data)
    }

    const settyping=(e)=>{  
        setMessage({...message,message:e.target.value,messagecreate:e.target.value})
        if(message.message.length<3){
            let data={
            type: "message",
            typing:e.target.value,
            sent_by: state.user.user_id,
            send_to: parseInt(`${message.thread_choice.info_thread.find(user=>user.user_id!==state.user.user_id).user_id}`),
            thread_id:message.thread_choice.id,
            count_uploadfile: state.list_file_chat.length
            }
            data = JSON.stringify(data)
            socket.current.send(data)
        }
    }
    
    const senmessage=()=>{
        let data = {
            type: "message",
            message: message.message,
            sent_by: state.user.user_id,
            send_to: parseInt(`${message.thread_choice.info_thread.find(user=>user.user_id!==state.user.user_id).user_id}`),
            thread_id:message.thread_choice.id,
            count_uploadfile: state.list_file_chat.length,
            list_uploadfile: state.list_file_chat,
            product:{},
            order:{}
        }
        data = JSON.stringify(data)
        socket.current.send(data)
        setMessage({...message,message:''})
    }

    const addmessage=(e)=>{
        e.stopPropagation()
        if(state.loading && e.target.scrollTop==0 && list_messages.length<message.thread_choice.count_message){
            setState({...state,loading:false})
            let url= new URL(listThreadlURL)
            let search_params=url.searchParams
            search_params.set('thread_id',message.thread_choice.id)
            search_params.set('offset',list_messages.length)
            url.search = search_params.toString();
            let new_url = url.toString();
            axios.get(new_url,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
            .then(res=>{
                setState({...state,loading:true})
                const list_message=[...res.data.messages,...list_messages]
                e.target.scrollTop = 60
                setListmessages(list_message)
            })
        }
        else{
            setState({...state,loading:true}) 
        }
    }

    const onBtnClick=(e)=>{
        console.log(e.currentTarget)
        e.currentTarget.querySelector('input').click()
    }

    const listdate=()=>{
        let list_days_unique=[]
        let list_days=[]
        const list_day=list_messages.map(message=>{
            return(("0" + new Date(message.created).getDate()).slice(-2) + "-" + ("0"+(new Date(message.created).getMonth()+1)).slice(-2) + "-" +
            new Date(message.created).getFullYear())
        })
        for(let j=0;j<list_day.length;j++){
            if(list_days[list_day[j]]) continue;
            list_days[list_day[j]] = true;
            list_days_unique.push(j)
        }
        return list_days_unique
    }
    
    let list_file_chat=[]
    let time_out=0
    const previewFile=(e)=>{
        [].forEach.call(e.target.files, function(file) {
            if ((/image\/.*/.test(file.type))){
                list_file_chat.push({file:file,file_preview:undefined,duration:0,filetype:'image',
                    file_name:file.name,media_preview:(window.URL || window.webkitURL).createObjectURL(file)})
                setState({...state,list_file_chat:[...state.list_file_chat,...list_file_chat]})
            }
            else if(file.type.match('video.*')){ 
                time_out=(e.target.files.length/2)*1000
                console.log('ok')
                var url = (window.URL || window.webkitURL).createObjectURL(file);
                var video = document.createElement('video');
                var timeupdate = function() {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                    video.pause();
                  }
                };
                video.addEventListener('loadeddata', e =>{
                        
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                  }
                });
                let snapImage = function() {
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                let image = canvas.toDataURL("image/png");
                let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
                let success = image.length > 100000;
                
                if (success) {
                    list_file_chat.push({file_name:file.name,filetype:'video',file:file,file_preview:file_preview,'duration':video.duration,media_preview:(window.URL || window.webkitURL).createObjectURL(file_preview)})
                    
                    setState({...state,list_file_chat:[...state.list_file_chat,...list_file_chat],time_out:time_out})
                    URL.revokeObjectURL(url);
                  }
                  return success;
                };
                video.addEventListener('timeupdate', timeupdate);
                video.preload = 'metadata';
                video.src = url;
                // Load video in Safari / IE11
                video.muted = true;
                video.playsInline = true;
                video.play();
                }
                else{
                    list_file_chat.push({file_name:file.name,filetype:'pdf',file:file,file_preview:undefined,duration:0})
                    setState({...state,list_file_chat:[...state.list_file_chat,...list_file_chat]})
                }
            })
        
        function remURL() {(window.URL || window.webkitURL).revokeObjectURL(this.src)}
        setTimeout(function() {
            let form=new FormData()
            form.append('thread_id',message.thread_choice.id)
            list_file_chat.map(file=>{
                form.append('file',file.file)
                form.append('file_preview',file.file_preview)
                form.append('duration',file.duration)
                form.append('name',file.file_name)
            })
            axios.post(updatefileURL,form,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
            .then(res=>{
                const list_uploadfile=[...message.list_uploadfile,...res.data.list_file]
                setMessage({...message,list_uploadfile:list_uploadfile})
             })
        }, time_out);
    }

    const deletefile=(file,i)=>{
        let form=new FormData()
        form.append('file_id',message.list_uploadfile[i].id)
        axios.post(updatefileURL,form,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
        .then(res=>{
            state.list_file_chat.splice(i,1)
            setState({...state,list_file_chat:state.list_file_chat})
            message.list_uploadfile.splice(i,1)
            setMessage({...message,list_uploadfile:message.list_uploadfile})
        })
    }

    const chatproduct=()=>{
        setState({...state,loading:false,show_order:false,show_product:!state.show_product,choice:'item'})
        setShop({...shop,choice:'item'})
            let url= new URL(listThreadlURL)
            let search_params=url.searchParams
            if(message.thread_choice.shop_name_sender!=null && message.thread_choice.sender.user_id==state.user.user_id){
                search_params.append('shop_name',message.thread_choice.shop_name_sender)
            }
            else{
                search_params.append('shop_name',message.thread_choice.shop_name_receiver)
            }
            search_params.append('item','item')
            url.search = search_params.toString();
            let new_url = url.toString();
            if(shop.list_items.length==0){
                axios.get(new_url,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
                .then(res=>{
                    setShop({...shop,list_items:res.data.list_items,choice:'item',count_product:res.data.count_product})
                    setState({...state,loading:true,show_order:false,show_product:!state.show_product})
                })
            }
            window.onClick=(event)=>{
                let parent=event.target.closest('.h-Inw1u5pm._1A9EZJDrfA')
                if(!parent){
                setShop({...shop,choice:null,list_orders:[]})
                setState({...state,show_product:false})
            }
        }
    }

    const chatorder=()=>{
        setState({...state,loading:false,show_product:false,show_order:!state.show_order})
        setShop({...shop,choice:'order'})
        let url= new URL(listThreadlURL)
        let search_params=url.searchParams
        if(message.thread_choice.sender.user_id!=state.user.user_id){
            search_params.append('shop_name',message.thread_choice.shop_name_sender)
        }
        else{
            search_params.append('shop_name',message.thread_choice.shop_name_receiver)
        }
        search_params.append('order','order')
        url.search = search_params.toString();
        let new_url = url.toString();
        if(!state.show_order && shop.list_orders.length==0){
            axios.get(new_url,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
            .then(res=>{
                setState({...state,loading:true,show_product:false,show_order:!state.show_order})
                setShop({...shop,list_orders:res.data.list_orders,choice:'order',count_order:res.data.count_order})
            })
        }
        window.onClick=(event)=>{
            let parent=event.target.closest('.h-Inw1u5pm._1A9EZJDrfA')
            if(!parent){
                setShop({...shop,choice:null,list_orders:[]})
                setState({...state,show_order:false})
            }
        }
    }

    const showmoreitem=(e,name)=>{
        let url= new URL(listThreadlURL)
        let search_params=url.searchParams
        if(e.target.scrollTop==e.target.scrollHeight-e.target.offsetHeight && state.loading){
            if(name=='item' && shop.count_product>shop.list_items.length){
                if(message.thread_choice.shop_name_sender!=null && message.thread_choice.sender==state.user){
                    search_params.append('name',message.thread_choice.shop_name_sender)
                }
                else{
                    search_params.append('name',message.thread_choice.shop_name_receiver)
                }
                search_params.append('item','item')
                search_params.append('from_item',shop.list_items.length)
                url.search=search_params.toString()
                let new_url=url.toString()
                axios.get(new_url,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
                .then(res => {
                    const list_items=[...shop.list_items,...res.data.list_items]
                    setShop({...shop,list_items:list_items})
                })
            }
            if(name=='order' && shop.count_product>shop.list_orders.length){
                if(message.thread_choice.sender!=state.user){
                    search_params.append('name',message.thread_choice.shop_name_sender)
                }
                else{
                    search_params.append('name',message.thread_choice.shop_name_receiver)
                }
                search_params.append('order','order')
                search_params.append('from_item',shop.list_orders.length)
                url.search = search_params.toString();
                let new_url = url.toString();
                axios.get(new_url,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
                .then(res => {
                    const list_orders=[...shop.list_orders,...res.data.list_orders]
                    setShop({...shop,list_orders:list_orders})
                })
            }
        }
    }
    
    const get_user=(thread)=>{
        return thread.info_thread.find(user=>user.user_id!=state.user.user_id)
    }
    
    return(
        <>
        {!state.errow?
        !show?
        <div onClick={()=>showthread()} className={`src-pages-index__root--1G_Ox ${state.count_unread.length>0?'unread':''}`}>
            <div className="src-pages-index__logo-wrapper--IqLfz">
                {state.count_unread.length>0?<div className="src-pages-index__counts--1f4Va">{state.count_unread.length>0?state.count_unread.length:''}</div>:''}
                <i className="_3kEAcT1Mk5 src-pages-index__chat--3rr3d">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="chat-icon"><path d="M18 6.07a1 1 0 01.993.883L19 7.07v10.365a1 1 0 01-1.64.768l-1.6-1.333H6.42a1 1 0 01-.98-.8l-.016-.117-.149-1.783h9.292a1.8 1.8 0 001.776-1.508l.018-.154.494-6.438H18zm-2.78-4.5a1 1 0 011 1l-.003.077-.746 9.7a1 1 0 01-.997.923H4.24l-1.6 1.333a1 1 0 01-.5.222l-.14.01a1 1 0 01-.993-.883L1 13.835V2.57a1 1 0 011-1h13.22zm-4.638 5.082c-.223.222-.53.397-.903.526A4.61 4.61 0 018.2 7.42a4.61 4.61 0 01-1.48-.242c-.372-.129-.68-.304-.902-.526a.45.45 0 00-.636.636c.329.33.753.571 1.246.74A5.448 5.448 0 008.2 8.32c.51 0 1.126-.068 1.772-.291.493-.17.917-.412 1.246-.74a.45.45 0 00-.636-.637z"></path></svg>
                </i>
                <i className="_3kEAcT1Mk5 src-pages-index__logo--2m8Mr">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 22" className="chat-icon"><path d="M9.286 6.001c1.161 0 2.276.365 3.164 1.033.092.064.137.107.252.194.09.085.158.064.203 0 .046-.043.182-.194.251-.26.182-.17.433-.43.752-.752a.445.445 0 00.159-.323c0-.172-.092-.3-.227-.365A7.517 7.517 0 009.286 4C5.278 4 2 7.077 2 10.885s3.256 6.885 7.286 6.885a7.49 7.49 0 004.508-1.484l.022-.043a.411.411 0 00.046-.71v-.022a25.083 25.083 0 00-.957-.946.156.156 0 00-.227 0c-.933.796-2.117 1.205-3.392 1.205-2.846 0-5.169-2.196-5.169-4.885C4.117 8.195 6.417 6 9.286 6zm32.27 9.998h-.736c-.69 0-1.247-.54-1.247-1.209v-3.715h1.96a.44.44 0 00.445-.433V9.347h-2.45V7.035c-.021-.043-.066-.065-.111-.043l-1.603.583a.423.423 0 00-.29.41v1.362h-1.781v1.295c0 .238.2.433.445.433h1.337v4.19c0 1.382 1.158 2.505 2.583 2.505H42v-1.339a.44.44 0 00-.445-.432zm-21.901-6.62c-.739 0-1.41.172-2.013.496V4.43a.44.44 0 00-.446-.43h-1.788v13.77h2.234v-4.303c0-1.076.895-1.936 2.013-1.936 1.117 0 2.01.86 2.01 1.936v4.239h2.234v-4.561l-.021-.043c-.202-2.088-2.012-3.723-4.223-3.723zm10.054 6.785c-1.475 0-2.681-1.12-2.681-2.525 0-1.383 1.206-2.524 2.681-2.524 1.476 0 2.682 1.12 2.682 2.524 0 1.405-1.206 2.525-2.682 2.525zm2.884-6.224v.603a4.786 4.786 0 00-2.985-1.035c-2.533 0-4.591 1.897-4.591 4.246 0 2.35 2.058 4.246 4.59 4.246 1.131 0 2.194-.388 2.986-1.035v.604c0 .237.203.431.453.431h1.356V9.508h-1.356c-.25 0-.453.173-.453.432z"></path></svg>
                </i>
            </div>
        </div>:
        
        <div className="chat-container">
            <div className="chat-header">
                <div className="chat-message-new">
                    <i className="_3kEAcT1Mk5 chat-header-logo icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 22" className="chat-icon"><path d="M9.286 6.001c1.161 0 2.276.365 3.164 1.033.092.064.137.107.252.194.09.085.158.064.203 0 .046-.043.182-.194.251-.26.182-.17.433-.43.752-.752a.445.445 0 00.159-.323c0-.172-.092-.3-.227-.365A7.517 7.517 0 009.286 4C5.278 4 2 7.077 2 10.885s3.256 6.885 7.286 6.885a7.49 7.49 0 004.508-1.484l.022-.043a.411.411 0 00.046-.71v-.022a25.083 25.083 0 00-.957-.946.156.156 0 00-.227 0c-.933.796-2.117 1.205-3.392 1.205-2.846 0-5.169-2.196-5.169-4.885C4.117 8.195 6.417 6 9.286 6zm32.27 9.998h-.736c-.69 0-1.247-.54-1.247-1.209v-3.715h1.96a.44.44 0 00.445-.433V9.347h-2.45V7.035c-.021-.043-.066-.065-.111-.043l-1.603.583a.423.423 0 00-.29.41v1.362h-1.781v1.295c0 .238.2.433.445.433h1.337v4.19c0 1.382 1.158 2.505 2.583 2.505H42v-1.339a.44.44 0 00-.445-.432zm-21.901-6.62c-.739 0-1.41.172-2.013.496V4.43a.44.44 0 00-.446-.43h-1.788v13.77h2.234v-4.303c0-1.076.895-1.936 2.013-1.936 1.117 0 2.01.86 2.01 1.936v4.239h2.234v-4.561l-.021-.043c-.202-2.088-2.012-3.723-4.223-3.723zm10.054 6.785c-1.475 0-2.681-1.12-2.681-2.525 0-1.383 1.206-2.524 2.681-2.524 1.476 0 2.682 1.12 2.682 2.524 0 1.405-1.206 2.525-2.682 2.525zm2.884-6.224v.603a4.786 4.786 0 00-2.985-1.035c-2.533 0-4.591 1.897-4.591 4.246 0 2.35 2.058 4.246 4.59 4.246 1.131 0 2.194-.388 2.986-1.035v.604c0 .237.203.431.453.431h1.356V9.508h-1.356c-.25 0-.453.173-.453.432z"></path></svg>
                    </i>
                    {state.count_unread.length>0?
                    <div className="chat-count-new-message">
                        <i className="_3kEAcT1Mk5 icon chat-close">
                            <svg viewBox="0 0 3 12" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M2.788 12L3 11.383c-.514-.443-.959-1.113-1.335-2.013-.376-.9-.564-2.01-.564-3.333v-.074c0-1.323.189-2.434.567-3.333.378-.9.822-1.553 1.332-1.961L2.788.006 2.754 0C2.102.354 1.48 1.063.888 2.127.296 3.19 0 4.473 0 5.974v.052c0 1.505.296 2.789.888 3.85.592 1.062 1.214 1.77 1.866 2.124h.034z"></path></svg>
                        </i>{state.count_unread.length>0?state.count_unread.length:''}
                        <i className="_3kEAcT1Mk5 icon chat-close">
                            <svg viewBox="0 0 3 12" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M.246 12c.648-.354 1.269-1.062 1.863-2.124C2.703 8.815 3 7.531 3 6.026v-.052c0-1.501-.297-2.784-.891-3.847C1.515 1.063.894.354.246 0H.212L0 .617c.48.42.917 1.09 1.31 2.01.393.92.59 2.032.59 3.336v.074c0 1.33-.191 2.454-.573 3.37-.382.917-.824 1.575-1.327 1.976L.212 12h.034z"></path></svg>
                        </i>
                    </div>:""}
                </div>
                <div className="operator-wrapper">
                    <div className="operator-item-wrapper">
                        <i className="_3kEAcT1Mk5 chat-hide-dialog icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="chat-icon"><path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H9v-1h5V2H9V1h5zM2 13v1h1v1H2a1 1 0 01-.993-.883L1 14v-1h1zm6 1v1H4v-1h4zM2 3.999V12H1V3.999h1zm5.854 1.319l2.828 2.828a.5.5 0 010 .708l-2.828 2.828a.5.5 0 11-.708-.707L9.121 9H4.5a.5.5 0 010-1h4.621L7.146 6.025a.5.5 0 11.708-.707zM3 1v1H2v.999H1V2a1 1 0 01.883-.993L2 1h1zm5 0v1H4V1h4z"></path></svg>
                        </i>
                    </div>
                    <div className="operator-item-wrapper">
                        <i onClick={()=>{setShow(false)}} className="_3kEAcT1Mk5 chat-hide-dialog icon">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12zm0 1H2v12h12V2zm-2.904 5.268l-2.828 2.828a.5.5 0 01-.707 0L4.732 7.268a.5.5 0 11.707-.707l2.475 2.475L10.39 6.56a.5.5 0 11.707.707z"></path></svg>
                        </i>
                    </div>
                </div>
            </div>
            <div className="chat-body">
                {state.show_chat?
                <div className="chat-window-detail">
                    {showemoji?
                    <Picker 
                    set='facebook' 
                    data={data}
                    style={{ position: 'absolute', top: '-70px', right: '0px',width:'340px',zIndex:1000 }}
                    title=''
                    
                    showPreview={false}
                    emojiSize={30}
                    showSkinTones={false}
                    exclude={['Search Results']}
                    emoji=''
                    
                    onClick={emoi=>setMessage({...message,message:emoi.native})}
                    showSkinTones={false}
                    />:''}
                    <div className="chat-shop-info item-center">
                        <div className="chat-shop-name">shop nhan</div>
                        <i className="icon-dropdown icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="chat-icon"><path d="M6.243 6.182L9.425 3l1.06 1.06-4.242 4.243L2 4.061 3.06 3z"></path></svg>
                        </i>
                    </div>
                    <div className="chat-message-detail">
                        <div className="chat-message-detail-wrap" id="messagesContainer">
                            {state.list_file_chat.length>0?
                            <div className="chat-mediapreview-wrap">
                                <section className="chat-mediapreview-section">
                                    <div className="chat-mediapreview-section-content">
                                        <div className="chat-mediapreview-section-files">   
                                            {state.list_file_chat.map((file,i)=>{
                                                if(file.filetype=="image" || file.filetype=="video"){
                                                    return(
                                                        <div className="vbUibIOQCdVGpvTHR9QZ5" key={i}>
                                                            <img className="_3KQNXANNUSJKR1Z2adRPjF" src={file.media_preview} />
                                                            {file.filetype=="video"?
                                                            <i className="_3kEAcT1Mk5 _3Fs5Tyt_FBVBTwz60zkqsd">
                                                                <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="16.3333" fill="black" fill-opacity="0.5" stroke="white" strokeWidth="0.666667"></circle><path fillRule="evenodd" clip-rule="evenodd" d="M23.0444 16.2005C23.5778 16.6005 23.5778 17.4005 23.0444 17.8005L15.0444 23.8005C14.3852 24.2949 13.4444 23.8245 13.4444 23.0005L13.4444 11.0005C13.4444 10.1764 14.3852 9.70606 15.0444 10.2005L23.0444 16.2005Z" fill="white"></path></svg>
                                                            </i>:''}
                                                            <i onClick={()=>deletefile(file,i)} className="icon-chat-message-delete">
                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#8EA4D1"></circle><path fillRule="evenodd" clip-rule="evenodd" d="M8 9.26316L10.7368 12L12 10.7368L9.26316 8L12 5.26316L10.7368 4L8 6.73684L5.26316 4L4 5.26316L6.73684 8L4 10.7368L5.26316 12L8 9.26316Z" fill="white"></path></svg>
                                                            </i>
                                                        </div>
                                                    )
                                                }
                                                else{
                                                    return(
                                                        <div className="item-center m7zwrmfr vbUibIOQCdVGpvTHR9QZ5 taijpn5t" key={i}>
                                                            <i onClick={()=>deletefile(file,i)} className="icon-chat-message-delete">
                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#8EA4D1"></circle><path fillRule="evenodd" clip-rule="evenodd" d="M8 9.26316L10.7368 12L12 10.7368L9.26316 8L12 5.26316L10.7368 4L8 6.73684L5.26316 4L4 5.26316L6.73684 8L4 10.7368L5.26316 12L8 9.26316Z" fill="white"></path></svg>
                                                            </i>
                                                            <div className="s45kfl79 emlxlaya item-center">
                                                                <i className="icon ">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="45.057px" height="45.057px" viewBox="0 0 45.057 45.057" style={{enableBackground:'new 0 0 45.057 45.057'}} xmlSpace="preserve">
                                                                        <g id="_x35_1_80_">
                                                                            <path d="M13.323,13.381c6.418,0,12.834,0,19.252,0c1.613,0,1.613-2.5,0-2.5c-6.418,0-12.834,0-19.252,0     C11.711,10.881,11.711,13.381,13.323,13.381z"/>
                                                                            <path d="M32.577,16.798c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,19.298,34.188,16.798,32.577,16.798z"/>
                                                                            <path d="M32.577,22.281c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,24.781,34.188,22.281,32.577,22.281z"/>
                                                                            <path d="M32.577,28.197c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,30.697,34.188,28.197,32.577,28.197z"/>
                                                                            <path d="M32.204,33.781c-6.418,0-12.834,0-19.252,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.834,0,19.252,0     C33.817,36.281,33.817,33.781,32.204,33.781z"/>
                                                                            <path d="M33.431,0H5.179v45.057h34.699V6.251L33.431,0z M36.878,42.056H8.179V3h23.707v4.76h4.992V42.056z"/>
                                                                        </g>
                                                                    </svg>
                                                                </i>
                                                            </div>
                                                            <div className="buofh1pr oo9gr5id item-center">
                                                                <span className="mau55g9w c8b282yb d3f4x2em iv3no6db">
                                                                    <span className="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7" style={{webkitBoxOrient: 'vertical', webkitLineClamp: 2, display: '-webkit-box'}}>{file.file_name}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                            <div onClick={(e)=>onBtnClick(e)} className="">
                                                <div>
                                                    <input onChange={(e)=>previewFile(e)} accept="video/*,.flv,.3gp,.rm,.rmvb,.asf,.mp4,.webm,image/png,image/jpeg,image/jpg" multiple="" type="file" style={{display: 'none'}}/>
                                                    <div className="add-file">
                                                        <i className="icon icon-add-file">
                                                            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="14.5" width="31" height="3" fill="#8EA4D1" stroke="#8EA4D1"></rect><rect x="17.5" y="0.5" width="31" height="3" transform="rotate(90 17.5 0.5)" fill="#8EA4D1" stroke="#8EA4D1"></rect></svg>
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat-message-action">
                                        <i className="icon-message">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className="chat-icon"><path d="M-1595 1c-282.8 0-512 229.2-512 512s229.2 512 512 512 512-229.2 512-512S-1312.2 1-1595 1zm313.3 380.4l-362 362c-16.7 16.7-43.7 16.7-60.3 0l-201.1-201.1c-16.7-16.7-16.7-43.7 0-60.3 16.7-16.7 43.7-16.7 60.3 0l171 171 331.8-331.9c16.7-16.7 43.7-16.7 60.3 0 16.7 16.6 16.7 43.7 0 60.3zM-117.3 42.7h-853.3c-23.6 0-42.7 19.1-42.7 42.7v853.3c0 23.6 19.1 42.7 42.7 42.7h853.3c23.6 0 42.7-19.1 42.7-42.7V85.3c-.1-23.5-19.2-42.6-42.7-42.6zm-115.4 340.7l-362 362c-16.7 16.7-43.7 16.7-60.3 0l-201.1-201.1c-16.7-16.7-16.7-43.7 0-60.3 16.7-16.7 43.7-16.7 60.3 0l171 171L-293 323.1c16.7-16.7 43.7-16.7 60.3 0 16.7 16.6 16.7 43.7 0 60.3zM601.9 512.1l402.3-401.5c25.1-25 25.1-65.7.1-90.8-25-25.1-65.7-25.1-90.8-.1L511.1 421.4 108.6 19.7c-25.1-25-65.7-25-90.8.1-25 25.1-25 65.7.1 90.8l402.3 401.5L17.9 913.6c-25.1 25-25.1 65.7-.1 90.8s65.7 25.1 90.8.1l402.5-401.7 402.5 401.7c25.1 25 65.7 25 90.8-.1s25-65.7-.1-90.8L601.9 512.1z"></path></svg>
                                        </i>
                                    </div>
                                </section>
                            </div>:''}
                            <div ref={scrollRef} onScroll={(e)=>addmessage(e)} className="chat-message-container" style={{overflowX: 'hidden',boxSizing: 'border-box',direction: 'ltr',height: '242px',position: 'relative',padding: '0 7.5px',width: '283px',willChange: 'transform',overflowY: 'auto'}}> 
                                {state.loading?'':<div className="item-centers">
                                    <div className="loader"></div>
                                </div>}
                                {list_messages.map((message,i)=>
                                <div key={i}>
                                    {listdate().includes(i)?
                                        <div className="chat-message-time">{checkDay(new Date(message.created))=="Today"?`${("0" + new Date(message.created).getHours()).slice(-2)}:${("0" + new Date(message.created).getMinutes()).slice(-2)}`:checkDay(new Date(message.created))=="Yesterday"?`Yesterday, ${("0" + new Date(message.created).getHours()).slice(-2)}:${("0" + new Date(message.created).getMinutes()).slice(-2)}`:`${("0" + new Date(message.created).getDate()).slice(-2)} Th${("0"+(new Date(message.created).getMonth()+1)).slice(-2)} ${new Date(message.created).getFullYear()}, ${("0" + new Date(message.created).getHours()).slice(-2)}:${("0" + new Date(message.created).getMinutes()).slice(-2)}`}</div>
                                    :''}
                                    <div className={`chat-message-table ${message.sender==state.user.username?'chat-message-sender':'chat-message-receiver'}`}>
                                        {message.text!=null && message.text!=''?
                                        <div className="chat-message">
                                            <pre className="message-send message-text">{message.text}</pre>
                                        </div>:""}
                                        {message.list_file.length>0?
                                        <div className="chat-message">
                                            {message.list_file.filter(file=>file.filetype=='image').length>0?
                                            <div className="chat-message-images">
                                            {message.list_file.map(file=>{
                                                if(file.filetype=='image'){
                                                    return(
                                                    <div key={file.file} style={{width:`${message.list_file.length==1?'200px':''}`}} className={`chat-file ${message.list_file.length>2?'kuivcneq':message.list_file.length==2?'hkbzh7o3':''}`}>
                                                        <div className="chat-message-image">
                                                            <div className="image">
                                                                <img className="chat-image" src={file.media_preview!=undefined?file.media_preview:file.file} alt="" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    )
                                                }
                                            })}
                                            </div>:''}
                                            {message.list_file.map(file=>{
                                                if(file.filetype=='video'){
                                                    return(
                                                        <div className='chat-message-file' key={file.file}>
                                                            <div className="chat-messsage-file-preview">
                                                                <img className="chat-image-preview" src={file.media_preview!=undefined?file.media_preview:file.file_preview} alt=""/>
                                                                <div className="chat-message-image-preview-wrap">
                                                                <div className="chat-message-image-preview-pause">
                                                                    <div className="chat-message-image-preview-icon">
                                                                        <svg viewBox="0 0 25 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clip-rule="evenodd" d="M0 2.79798C0 1.18996 1.8014 0.239405 3.12882 1.14699L23.9004 15.3489C25.062 16.1431 25.062 17.8567 23.9004 18.6509L3.12882 32.8529C1.8014 33.7605 0 32.8099 0 31.2019V2.79798Z" fill="white"></path></svg>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                                <div className="chat-message-video-duration">00:{Math.round(file.duration)}</div>
                                                            </div>
                                                        </div> 
                                                    )
                                                }
                                                if(file.filetype=='pdf'){
                                                    return(
                                                        <div className='chat-file-document-container' key={file.file}>
                                                            <a href={file.file} target="_blank">
                                                                <div className="chat-file-document-content">
                                                                    <div className="chat-icon-document">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="45.057px" height="45.057px" viewBox="0 0 45.057 45.057" style={{enableBackground:'new 0 0 45.057 45.057'}} xmlSpace="preserve">
                                                                            <g>
                                                                                <path d="M13.323,13.381c6.418,0,12.834,0,19.252,0c1.613,0,1.613-2.5,0-2.5c-6.418,0-12.834,0-19.252,0     C11.711,10.881,11.711,13.381,13.323,13.381z"/>
                                                                                <path d="M32.577,16.798c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,19.298,34.188,16.798,32.577,16.798z"/>
                                                                                <path d="M32.577,22.281c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,24.781,34.188,22.281,32.577,22.281z"/>
                                                                                <path d="M32.577,28.197c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,30.697,34.188,28.197,32.577,28.197z"/>
                                                                                <path d="M32.204,33.781c-6.418,0-12.834,0-19.252,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.834,0,19.252,0     C33.817,36.281,33.817,33.781,32.204,33.781z"/>
                                                                                <path d="M33.431,0H5.179v45.057h34.699V6.251L33.431,0z M36.878,42.056H8.179V3h23.707v4.76h4.992V42.056z"/>
                                                                            </g>
                                                                        </svg>
                                                                    </div>
                                                                    <div className="buofh1pr oo9gr5id lrazzd5p qv66sw1b">
                                                                        <div className="chat-file-name" style={{webkitLineClamp: 3}}>{file.file_name}</div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>:Object.keys(message.message_order).length>0?
                                        <div className="onDrqkSpt9r3zn_6p3pRf _18r49d6bjodvFmJMZ-4Ew5">
                                            <div className="KIDOiX8kg8qYOZk2r28XZ">
                                                <div className="_2rOpog8D_jhF1evUqNokLy">????N H??NG</div>
                                                <div className="_2CAkb_LMf57hsgDBtSNYew">
                                                    <div className="_2obfFH3oH2jVsvdvjYZoPK">
                                                        <img alt="" src={message.message_order.item_image}/>
                                                        <div></div>
                                                    </div>
                                                    <div className="_2E0sI6wm9acOLm_2ioVqAs">
                                                        <div className="_1Gsk8KcmxOiyCa572sYIgY">
                                                            <div className={`_4Rre943DmKbgF7ChJZzS ${message.message_order.canceled?'_5cjqTTn1-EwQpqCWOJUC2':message.message_order.received?'_2_8fZmU8_RrKDY8dWgF5_q':'_1g431B6tnDb9O6uIPAz3Yv'}`}></div>
                                                            <div className="_3t_t657LT1vpua8FTRvt6a">{message.message_order.canceled?'???? h???y':message.message_order.received?'Ho??n t???t':message.message_order.received?'??ang v???n chuy???n':'Ch??? x??c nh???n'}</div>
                                                        </div>
                                                        <div className="_1YkKqqrhlAZhrxNylsozUT">{message.message_order.total_quantity} S???n ph???m</div>
                                                    </div>
                                                </div>
                                                <div className="_3RhC3E-K1SW0dO9GXnXAdD">
                                                    <div className="_1J50foL86TucYAx5ydsfRg">
                                                        <div className="_1_YEoXvsxaosJh4Z-TcdSL">T???ng Gi?? Tr??? Thanh To??n t??? Ng?????i Mua:</div>
                                                        <div className="_3m3ryYq5AE6bex0iq6qTCI">???-{message.message_order.amount}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>:Object.keys(message.message_product).length>0?
                                        <div className="xaMUYIRSRlS1WYaJbpOwG DAgS9n3scQ7kWR3b9O-Va _1-jFwlhhdMvfDXAJH72LUv">
                                            <div className="_3QAhrlbRryynyUr5qWoKQI lz9DXMa2SXtyOYAO75qni _35qRx_AaOlKkCRdT9mxgpd">
                                                <div className="_23vIMkrJSmAutLCB7Ij2em _2X1TUK7H0DhwKmtYbhlI-X">S???N PH???M</div>
                                                <div className="_6Xm-D7r5WnFY6uYol5Kap _2epMrgoXN2eHh21pkul4Mb">
                                                    <div className="_3pFyGIEaNgxkRnbeKyPPH_ _3BJ3YZnd5in6Oa4OeXk46l">
                                                        <img alt="" src={message.item.item_image}/>
                                                        <div className="_3S9lhUuu_xLD2wRIFTBHcu UQVw8QcM73dDYBLjXSHWx"></div>
                                                    </div>
                                                    <div className="_3thfodiVvC50D2x1ugPwYo _3n6zITUI2b4Lg7e1__VQEA">
                                                        <div className="_26g_TvGhI16BdqQtLfO9Zg _3UFMQVR3oMb11RwBYnnlX-" title={message.item.item_name}>{message.item.item_name}</div>
                                                        <div className="_2Mx59X86NQm-jW1ofkSA3U WI3qR2JrgxwzAK6vV2M7g">
                                                            <div className="_3YQ_qVknzTkiquZzAybJ5x wv-n-n7UHQV6SLVBAt4Mx">
                                                                <div className="_2vu1W9DIq3TR0Pv9Pjv5oy">
                                                                    <div className={`chat-product-price-${message.item.program_valid>0?'old':'current'}`}>
                                                                        ???{formatter.format(message.item.item_min)} {message.item.item_min!==message.item.item_max?`- ???${formatter.format(message.item.item_max)}`:''}
                                                                    </div>
                                                                    {message.item.program_valid>0?
                                                                    <div className="chat-product-price-curent">
                                                                        ???{formatter.format(message.item.item_min*(100-message.item.percent_discount)/100)}
                                                                        {message.item.item_min!==message.item.item_max?
                                                                        `- ???${formatter.format(message.item.item_max*(100-message.item.percent_discount)/100)}`:''}
                                                                    </div>
                                                                    :''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>:''}
                                    </div> 
                                </div>
                                )}
                                {state.typing && state.user.user_id==state.send_to?
                                <div className="chat-message-table chat-message-receiver" style={{marginTop: '8px'}}>
                                    <div className="chat-message">
                                        <div className="chat-typing">
                                            typing
                                            <div className="typing">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>:''}
                            </div>
                        </div>
                        
                        <div className="chat-input">
                            <div className="chat-input-field-index">
                                <div className="chat-inputfield-chateditor-index__root">
                                    <textarea onChange={(e)=>settyping(e)} 
                                    value={message.message}
                                    className="chat-inputfield-chateditor-index__editor" 
                                    placeholder="G???i tin nh???n" style={{overflow: 'hidden',height: '26px'}}></textarea>
                                    <div onClick={()=>senmessage()} className="chat-send-button">
                                        <div className="chat-send-tooltip">
                                            <i className="icon chat-index__button">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M4 14.497v3.724L18.409 12 4 5.779v3.718l10 2.5-10 2.5zM2.698 3.038l18.63 8.044a1 1 0 010 1.836l-18.63 8.044a.5.5 0 01-.698-.46V3.498a.5.5 0 01.698-.459z"></path></svg>
                                            </i>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-index__toolbar">
                                    <div className="chat-inputfield-toolbar">
                                        <div className="chat-inputfield-toolbar__left">
                                            <div onClick={()=>setShowemoji(!showemoji)} className="chat-inputfield-toolbar-index__drawer" aria-label="Sticker">
                                                <div className="">
                                                    <div className="">
                                                        <i className="icon chat-inputfield-toolbar-index__stickers chat-inputfield-toolbar__label chat-inputfield-toolbar__inactive-label">
                                                            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M9 1a8 8 0 110 16A8 8 0 019 1zm0 1.6a6.4 6.4 0 100 12.8A6.4 6.4 0 009 2.6zM5 9.8h8a4 4 0 01-7.995.2L5 9.8h8-8zm1.2-4a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm5.6 0a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path></svg>
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={(e)=>onBtnClick(e)} className="chat-inputfield-toolbar-index__drawer" aria-label="Picture">
                                                <div>
                                                    <input onChange={(e)=>previewFile(e)} accept="image/png,image/jpeg,image/jpg" multiple={true} type="file" style={{display: 'none'}}/>
                                                    <div className="">
                                                        <i className="icon chat-inputfield-toolbar-index__stickers chat-inputfield-toolbar__label chat-inputfield-toolbar__inactive-label">
                                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M19 18.974V5H5v14h.005l4.775-5.594a.5.5 0 01.656-.093L19 18.974zM4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm11.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"></path></svg>
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={(e)=>onBtnClick(e)} className="chat-inputfield-toolbar-index__drawer" aria-label="Video">
                                                <div>
                                                    <input onChange={(e)=>previewFile(e)} accept="video/*,.flv,.3gp,.rm,.rmvb,.asf,.mp4,.webm" multiple={true} type="file" style={{display: 'none'}}/>
                                                    <div className="">
                                                        <i className="icon chat-inputfield-toolbar-index__video chat-inputfield-toolbar__label chat-inputfield-toolbar__inactive-label">
                                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path fillRule="evenodd" clip-rule="evenodd" d="M19.974 3h-16a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zm-15 16V5h14v14h-14z"></path><path d="M15.42 11.733a.3.3 0 010 .534L9.627 15.24a.3.3 0 01-.437-.267V9.027a.3.3 0 01.437-.267l5.793 2.973z"></path></svg>
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={(e)=>onBtnClick(e)} className="chat-inputfield-toolbar-index__drawer" aria-label="File">
                                                <div>
                                                    <input onChange={(e)=>previewFile(e)} multiple="" type="file" style={{display: 'none'}}/>
                                                    <div className="">
                                                        <i className="icon chat-inputfield-toolbar-index__file chat-inputfield-toolbar__label chat-inputfield-toolbar__inactive-label">
                                                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="45.057px" height="45.057px" viewBox="0 0 45.057 45.057" style={{enableBackground:'new 0 0 45.057 45.057'}} xmlSpace="preserve">
                                                                <g>
                                                                <path d="M13.323,13.381c6.418,0,12.834,0,19.252,0c1.613,0,1.613-2.5,0-2.5c-6.418,0-12.834,0-19.252,0     C11.711,10.881,11.711,13.381,13.323,13.381z"></path>
                                                                <path d="M32.577,16.798c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,19.298,34.188,16.798,32.577,16.798z"></path>
                                                                <path d="M32.577,22.281c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,24.781,34.188,22.281,32.577,22.281z"></path>
                                                                <path d="M32.577,28.197c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,30.697,34.188,28.197,32.577,28.197z"></path>
                                                                <path d="M32.204,33.781c-6.418,0-12.834,0-19.252,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.834,0,19.252,0     C33.817,36.281,33.817,33.781,32.204,33.781z"></path>
                                                                <path d="M33.431,0H5.179v45.057h34.699V6.251L33.431,0z M36.878,42.056H8.179V3h23.707v4.76h4.992V42.056z"></path>
                                                                </g>
                                                            </svg>
                                                        
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div onClick={()=>chatproduct()} className="chat-inputfield-toolbar-index__drawer" aria-label="Porducts">
                                                <div className="">
                                                    <div className="">
                                                        <i className="icon chat-inputField-toolbar-index__products chat-inputfield-toolbar__label chat-inputfield-toolbar__inactive-label">
                                                            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M14.442 2c.413 0 .753.322.776.735l.692 12.444a.778.778 0 01-.734.82l-.043.001H2.777a.778.778 0 01-.772-.687L2 15.2l.692-12.466A.778.778 0 013.47 2h10.973zm-.736 1.556H4.204L3.734 12h10.441l-.469-8.444zm-1.64 1.556v1.042l-.004.149C11.978 7.825 10.601 9 8.955 9c-1.698 0-3.11-1.252-3.11-2.846V5.12H7.4v1.034l.005.103c.063.646.716 1.187 1.55 1.187.879 0 1.556-.6 1.556-1.29V5.111h1.555z"></path></svg>
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={()=>chatorder()} className="chat-inputfield-toolbar-index__drawer" aria-label="Orrders">
                                                <div className="">
                                                    <div className="">
                                                        <i className="icon chat-inputField-toolbar-index__orders chat-inputfield-toolbar__label chat-inputfield-toolbar__inactive-label">
                                                            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M5.111 2.003v1.365h7.778V2.003h2.333c.43 0 .778.354.778.79v8.44a2 2 0 01-.575 1.404l-2.726 2.767a2 2 0 01-1.425.596H2.778A.784.784 0 012 15.21V2.794c0-.436.348-.79.778-.79H5.11zm9.333 2.944H3.556v9.474H11V11.5a.5.5 0 01.5-.5h2.944V4.947zM12.89 8.105v1.58H5.11v-1.58h7.778zM11.61 1a.5.5 0 01.5.5v1.079H5.89V1.5a.5.5 0 01.5-.5h5.222z"></path></svg>
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="chatwindow-index__blank--2pLm1">
                    <div className="chatwindow-index__plate--2ADRp">
                        <img src="http://localhost:8000/media/my_web/6abdc0872a25853b36d17e7498335326.png" className="chatwindow-index__image--3GQ-r"/>
                    </div>
                    <div className="chatwindow-index__title--200qt">Xin Ch??o!</div>
                </div>}
                <div className="chat-conversationlists-index">
                    <div className="chat-conversationlists-headerbar-index">
                        <div className="chat-conversationlists-headerbar-index-index__search">
                            <input className="chat-conversationlists-headerbar-index-index__input" placeholder="T??m theo t??n kh??ch h??ng" value=""/>
                            <div className="chat-conversationlists-headerbar-index-index__wrapper">
                                <i className="icon chat-conversationlists-headerbar-index-index__icon">
                                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><g transform="translate(3 3)"><path d="M393.846 708.923c174.012 0 315.077-141.065 315.077-315.077S567.858 78.77 393.846 78.77 78.77 219.834 78.77 393.846s141.065 315.077 315.077 315.077zm0 78.77C176.331 787.692 0 611.36 0 393.845S176.33 0 393.846 0c217.515 0 393.846 176.33 393.846 393.846 0 217.515-176.33 393.846-393.846 393.846z"></path><rect transform="rotate(135 825.098 825.098)" x="785.713" y="588.79" width="78.769" height="472.615" rx="1"></rect></g></svg>
                                </i>
                            </div>
                        </div>
                        <div className="chat-conversationlists-headerbar-index-index__filter chat-conversationlists-headerbar-index-index__reddot-filter--1McFP">
                            <div className="chat-conversationlists-headerbar-index-index__reddot"></div>
                            <div className="chat-components-common-menus-index__root">
                                <div className="chat-components-common-menus-index__popover">
                                    <div className="chat-components-common-menus-index__button">
                                        <div className="chat-conversationlists-headerbar-index-index__selected">T???t c???
                                            <i className="icon chat-conversationlists-headerbar-index-index__arrow-down">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="chat-icon"><path d="M6.243 6.182L9.425 3l1.06 1.06-4.242 4.243L2 4.061 3.06 3z"></path></svg>
                                            </i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chat-conversation-lists-container chat-index__conversation-lists">
                        <div className="chat-message-container" style={{height: '100%',boxSizing: 'border-box',direction: 'ltr',position: 'relative',width: '222px',willChange: 'transform',overflow: 'auto'}}>
                            {list_threads!=null?
                            <div className="chat-message-container">
                                {list_threads.map((thread,i)=>
                                    <div key={i} onClick={()=>showmessage(thread)} className="chat-pages-index__root" style={{height: '48px', left: '0px', position: 'absolute', top: `${i*48}px`, width: '100%'}}>
                                        <div className="chat-pages-index__avatar">
                                            <div className="chat-avatar-index__avatar-wrapper">
                                                <img alt="" src={`${localhost}${get_user(thread).shop_logo}`} />
                                                <div className="chat-avatar-index__avatar-border"></div>
                                            </div>
                                        </div>
                                        <div className="chat-pages-index__container">
                                            <div className="chat-pages-index__upper">
                                                <div className="chat-pages-index__username" title={get_user(thread).shop_name!=undefined?get_user(thread).shop_name:get_user(thread).username}>{get_user(thread).shop_name!=undefined?get_user(thread).shop_name:get_user(thread).username}</div>
                                            </div>
                                            <div className="chat-pages-index__lower">
                                                {thread.message.length>0?
                                                <>
                                                {thread.message[0].text!=null?
                                                <div className={`${thread.message[0].sender!=state.user.username?'q66pz984':''} text-overflow`}>{thread.message[0].text}</div>
                                                :thread.message[0].list_file.length>0?
                                                thread.message[0].list_file[0].filetype=='image'?
                                                <>
                                                <i className="icon image-icon">
                                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M19 18.974V5H5v14h.005l4.775-5.594a.5.5 0 01.656-.093L19 18.974zM4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm11.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"></path></svg>
                                                </i>
                                                image</>:
                                                <>
                                                <i className="icon icon-document"> 
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="45.057px" height="45.057px" viewBox="0 0 45.057 45.057" style={{enableBackground:'new 0 0 45.057 45.057'}} xmlSpace="preserve">
                                                        <g>
                                                        <path d="M13.323,13.381c6.418,0,12.834,0,19.252,0c1.613,0,1.613-2.5,0-2.5c-6.418,0-12.834,0-19.252,0     C11.711,10.881,11.711,13.381,13.323,13.381z"></path>
                                                        <path d="M32.577,16.798c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,19.298,34.188,16.798,32.577,16.798z"></path>
                                                        <path d="M32.577,22.281c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,24.781,34.188,22.281,32.577,22.281z"></path>
                                                        <path d="M32.577,28.197c-6.418,0-12.835,0-19.253,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.835,0,19.253,0     C34.188,30.697,34.188,28.197,32.577,28.197z"></path>
                                                        <path d="M32.204,33.781c-6.418,0-12.834,0-19.252,0c-1.612,0-1.612,2.5,0,2.5c6.418,0,12.834,0,19.252,0     C33.817,36.281,33.817,33.781,32.204,33.781z"></path>
                                                        <path d="M33.431,0H5.179v45.057h34.699V6.251L33.431,0z M36.878,42.056H8.179V3h23.707v4.76h4.992V42.056z"></path>
                                                        </g>
                                                    </svg>
                                                </i>
                                                file</>:
                                                Object.keys(thread.message[0].message_order).length>0?
                                                <div className="text-overflow">Cam on ban da dat hang</div>:
                                                <div className="text-overflow">Cam on ban da quan tam san pham</div>}
                                                </>
                                                :""}
                                            </div>
                                        </div>
                                        <div className="chat-messsage-time-last">
                                            {thread.message.length>0?`${("0" + new Date(thread.message[0].created).getHours()).slice(-2)} : ${("0" + new Date(thread.message[0].created).getMinutes()).slice(-2)}`:''}
                                        </div>
                                        {thread.count_message_not_seen>0 && thread.message[0].sender!=state.user.username?
                                        <div className="unread-message" id="unRead1">
                                            <span className="badge badge-soft-danger rounded-pill">{thread.count_message_not_seen>0 && thread.message[0].sender!=state.user.username?thread.count_message_not_seen>99?'99+':thread.count_message_not_seen:''}</span>
                                        </div>:""}
                                    </div>
                                )}
                            </div>:""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        :''}
        {state.show_product || state.show_order?
        <div className="src-product">
            <div className="src-product-content--1mfan">
                <div className="src-components-index__root--3vLtz">
                    {shop.choice=='item'?
                    <>
                    <div className="src-components-index__tabs--Y19NK">
                        {(message.thread_choice.shop_logo_sender!=null && message.thread_choice.sender.user_id==state.user.user_id || message.thread_choice.shop_logo_receiver!=null && message.thread_choice.received.user_id==state.user.user_id)?
                        <div className="src-components-index__active--2KOj5 src-components-index__header--2FJYt src-modules-ProductPopover-index__complete--3dtzk">
                            <div className="src-modules-ProductPopover-index__tab-nav--2eBWV">
                                <div className="src-modules-ProductPopover-index__shop-icon--2Vxmd">
                                    <div className="src-components-avatar-index__root--2xGjv undefined">
                                        <div className="src-components-avatar-index__avatar-wrapper--29uog">
                                            <img alt="" src={message.thread_choice.shop_logo_sender}/>
                                            <div className="src-components-avatar-index__avatar-border--2Wkz3"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="src-modules-component-index__shop-name" title="My shop">My shop</div>
                            </div>
                        </div>:''}
                        {message.thread_choice.shop_logo_receiver!=null?
                        <div className=" src-components-index__header--2FJYt src-modules-ProductPopover-index__complete--3dtzk">
                            <div className="src-modules-ProductPopover-index__tab-nav--2eBWV">
                                <div className="src-modules-ProductPopover-index__shop-icon--2Vxmd">
                                    <div className="src-components-avatar-index__root--2xGjv undefined">
                                        <div className="src-components-avatar-index__avatar-wrapper--29uog">
                                            <img alt="" src="${info_item[0].shop_logo}"/>
                                            <div className="src-components-avatar-index__avatar-border--2Wkz3"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="src-modules-component-index__shop-name" title="${info_item[0].shop_name}">{message.thread_choice.shop_name}</div>
                            </div>
                        </div>:''}
                    </div>
                    <div className="src-components-index__main--RhtCG">
                        <section className="src-modules-index__container--2BjL8">
                            <div className="src-modules-index__search-bar--Qg28R">
                                <div className="src-components-searchbar-index__root--Cgb3Z">
                                    <div className="src-components-searchbar-index__wrapper--eFqTf ">
                                        <div className="src-components-searchbar-index__icon-wrapper--3d4w9">
                                            <i className="src-components-searchbar-index__icon--2w7NP">
                                                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><g transform="translate(3 3)"><path d="M393.846 708.923c174.012 0 315.077-141.065 315.077-315.077S567.858 78.77 393.846 78.77 78.77 219.834 78.77 393.846s141.065 315.077 315.077 315.077zm0 78.77C176.331 787.692 0 611.36 0 393.845S176.33 0 393.846 0c217.515 0 393.846 176.33 393.846 393.846 0 217.515-176.33 393.846-393.846 393.846z"></path><rect transform="rotate(135 825.098 825.098)" x="785.713" y="588.79" width="78.769" height="472.615" rx="1"></rect></g></svg>
                                            </i>
                                        </div>
                                        <input className="src-components-searchbar-index__input--3oQvj" placeholder="T??m ki???m" value=""/>
                                        <div className="src-components-searchbar-index__cancel--35r5V" style={{display: 'none'}}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="src-modules-ProductList-index__scroll-container--1nAlr">
                                <div onScroll={(e)=>showmoreitem(e,'item')} className="src-components-Common-ScrollList-style__root--31xcV">
                                    {shop.list_items.map(item=>
                                        <div className="src-modules-index__product-item-wrapper--3-OJA" key={item.item_id}>
                                        <div className="src-modules-index__product-body--1UERO ">
                                            <img alt="" className="src-modules-index__product-pic--249Pa" src={item.item_image}/>
                                            <div className="src-modules-index__product-info--3kIT7">
                                                <div className="src-modules-index__product-name--1rUla">
                                                    <div style={{overflow: 'hidden', textOverflow: 'ellipsis', webkitboxorient: 'vertical', display: 'webkitbox', webkitlineclamp: 1}}>
                                                        <div style={{width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-all', whiteSpace: 'nowrap'}}> {item.item_name}</div>
                                                    </div>
                                                </div>
                                                {formatter.format(item.item_min)} {item.item_min!=item.item_max?`- ${formatter.format(item.item_max)}`:''}
                                            </div>
                                        </div>
                                        <div className="src-modules-index__product-footer--1mBzI ">
                                            <div onClick={()=>sendproduct(item)} className="src-modules-component-index__send-btn">G???i</div>
                                            <div className="src-modules-index__sale-info--2zzaj">
                                                <div className="src-modules-index__vertical-line--on9T6">{item.item_inventory} c?? s???n</div>
                                                <div>{item.num_order} ???? b??n</div>
                                            </div>
                                        </div>
                                    </div>     
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                    </>
                    :
                    <>
                    <div className="src-components-Common-ListContainer-index__tabs--Y19NK">
                        <div className="src-components-Common-ListContainer-index__header--2FJYt ">Mua</div>
                    </div>
                    <div className="src-components-index__main--RhtCG">
                        <div onScroll={(e)=>showmoreitem(e,'order')} className="src-components-Common-ScrollList-style__root--31xcV">
                            {shop.list_orders.map(order=>
                                <div className="src-modules-order-index__root--yf6BH" key={order.id}>
                                    <div className="src-modules-order-index__header--MQYX3">
                                        <div className="src-modules-order-index__shop--3s53F">
                                            <div className="src-modules-order-index__avatar--3WmjS">
                                                <div className="src-components-avatar-index__root--2xGjv undefined">
                                                    <i className=" _3kEAcT1Mk5 src-components-avatar-index__shop--1erCv">
                                                        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path fillRule="evenodd" clip-rule="evenodd" d="M1.438.5a.5.5 0 00-.485.382L.073 4.5A1.461 1.461 0 000 4.957C0 5.81.733 6.5 1.636 6.5a1.65 1.65 0 001.455-.835 1.65 1.65 0 001.454.835A1.65 1.65 0 006 5.665a1.65 1.65 0 001.455.835 1.65 1.65 0 001.454-.835 1.65 1.65 0 001.455.835C11.267 6.5 12 5.81 12 4.957c0-.102-.01-.201-.03-.298h.002L11.048.881A.5.5 0 0010.562.5H1.438zm8.926 6.98c.27 0 .532-.04.779-.114v3.277a1 1 0 01-1 1H1.857a1 1 0 01-1-1V7.366a2.704 2.704 0 001.5.017v2.76h7.286v-2.76c.23.063.473.097.72.097z"></path></svg>
                                                    </i>
                                                </div>
                                            </div>
                                            <div className="src-modules-order-index__name--MHX5O">{order.shop}</div>
                                        </div>
                                        <div className="src-modules-order-index__status--1opb5">
                                            <i className={`_3kEAcT1Mk5 src-modules-order-index__status-icon--BSEvA src-modules-order-index__${order.received?'completed':order.canceled?'canceled':'waiting'}--yk7cQ`}>
                                            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="chat-icon"><path d="M6 2.25v1.5h6v-1.5h3a.75.75 0 01.75.75v12a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V3A.75.75 0 013 2.25h3zm1.409 8.553L5.288 8.682l-1.061 1.06 3.182 3.183 6.364-6.364-1.06-1.061-5.304 5.303zM7.5 1.5h3a.75.75 0 01.75.75V3h-4.5v-.75a.75.75 0 01.75-.75z"></path></svg>
                                            </i>{order.received?'Ho??n t???t':order.canceled?'???? h???y':order.being_delivery?"??ang v???n chuy???n":'Ch??? x??c nh???n'}
                                        </div>
                                    </div>
                                    <div className="src-modules-order-index__products--3f0tb">
                                        {order.order_item.map(orderitem=>
                                            <div className="src-modules-orderCard-index__product--KTy0W" key={orderitem.id}>
                                                <div className="src-modules-orderCard-index__left--1P7zN src-modules-orderCard-index__center--3wE9z">
                                                    <img alt="" className="src-modules-orderCard-index__picture--2xI6-" src={orderitem.item_image}/>
                                                    <div>
                                                        <div className="src-modules-orderCard-index__name--hZc60">{orderitem.item_name}</div>
                                                        <div className="src-modules-orderCard-index__details--3V7Qm">Ph??n lo???i: {itemvariation(orderitem)}</div>
                                                    </div>
                                                </div>
                                                <div className="src-modules-orderCard-index__right--1ZZpT">
                                                    <div className="src-modules-orderCard-index__money--fhUD7">???{orderitem.price}</div>
                                                    <div className="src-modules-orderCard-index__count--27aZv">x{orderitem.quantity}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="src-modules-order-index__details--1RkzD src-modules-order-index__content--JZYlh">
                                        <div>T???ng C???ng</div>
                                        <div className="src-modules-order-index__content--JZYlh">
                                            <div className="src-modules-order-index__counts--274SY">{order.count_item} products</div>
                                            <div className="src-modules-order-index__payment--69nYO">???{formatter.format(order.total_final_order)}</div>
                                        </div>
                                    </div>
                                    <div className="src-modules-order-index__cancel--O-khp">
                                        {order.canceled?'H???y b???i b???n':''}
                                    </div>
                                    <div>
                                        <div className="src-modules-order-index__button--2IX82">Chi Ti???t</div>
                                        <div onClick={()=>sendorder(order)} className="src-modules-order-index__button--2IX82">G???i</div>
                                    </div>
                                </div>
                            )}
                        </div>   
                    </div>
                    </>}
                </div>
            </div>
        </div>
        :''}
        </>
    )
}

export default memo(Message)