
import {detailURL} from "../constants"
import axios from 'axios';
import Navbar from "./Navbar"
import Message from "./Chat"
import React, {useState, useEffect,useCallback} from 'react'
import { useParams,useLocation, Navigate,useSearchParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import Shopinfo from "./Shop";
import Categorydetail from './Categorydetail'
const Detailview = () => {
  const { slug } = useParams(); // <-- access id match param here
  const [list_threads,setThreads]=useState([]);
  const [data,setData]=useState();
  const [state, setState] = useState({show_thread:false,show_message:false});
  const [threadchoice,setThreadchoice]=useState()
  const[threads,setlistThreads]=useState([])
  const [listMessages,setListmessage]=useState([])
  const [cartitem,setCartitem]=useState([])
  const [params, setSearchParams] = useSearchParams();
  const [searchitem,setSearchitem]=useState({page:1,sortby:'pop'})
  useEffect(() => {
    const getJournal = async () => {
    await axios.get(detailURL+slug+'?'+params,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
      .then(res=>{
          setData(res.data)
            if(localStorage.token!=undefined){
              setThreads(res.data.list_threads)
          }
      })
    }
  getJournal();
  },[slug,params])

  const setsearchitem=(items)=>{
    setSearchitem(items) 
    setSearchParams(items)
  }
  
  const setthread=(data)=>{
    setlistThreads(data.threads)
    setListmessage(data.messages)
    setThreadchoice(data.threadchoice)
    setState({...state,show_thread:true,show_message:true})
  }
  const setsearchcategory=(name,value)=>{
    setSearchitem({...searchitem,[name]:value})
  }
  const addcartitem=useCallback((data)=>{
    let cartitemadd=cartitem
    if(cartitemadd.every(item=>item.id!=data.id)){
      cartitemadd.push(data)
    }
    setCartitem(cartitemadd)
    console.log(cartitem)
  },[cartitem])
  
  return(
    <>
      <div id="main">
        <div className="item-col top container-wrapper">
        {data!=null? 
          <Navbar 
            data={data}
            cartitem={cartitem}
          />:""}
        </div>
        {data!=null && data.category_info!=undefined?
          <Categorydetail
          setsearchitem={items=>setsearchitem(items)}
          params={params}
          searchitem={searchitem}
          data={data}
          listitem={data.list_item_page}
          setsearchcategory={(name,value)=>setsearchcategory(name,value)}
          />
        :''}
        {data!=null && data.item_name!=undefined?
          <ProductDetail
            data_product={data}
            list_threads={list_threads}
            thread_choice={threadchoice}
            setthread={e=>setthread(e)}
            
            addcartitem={data=>addcartitem(data)}
          />
        :''}
        {data!=null && data.shop!=undefined?
          <Shopinfo
            list_threads={list_threads}
            thread_choice={threadchoice}
            setthread={e=>setthread(e)}
            setsearchitem={items=>setsearchitem(items)}
            params={params}
            searchitem={searchitem}
            listitem={data.list_item_page}
            data={data}
            setsearchcategory={(name,value)=>setsearchcategory(name,value)}
        />
        :''}
      </div>
      <div id="modal"></div>
      <div id="mini-chat-embedded" style={{position: 'fixed', right: '8px', bottom: '0px', zIndex: 99999}}>
          <Message
            show_thread={state.show_thread}
            show_message={state.show_message}
            threads={threads}
            listMessages={listMessages}
            threadchoice={threadchoice}
          />
        </div>      
      </>
  )
}

export default Detailview;