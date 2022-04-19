import React,{useState,useEffect,createRef} from 'react';
import axios from 'axios';
import Navbar from "./Navbar"
import {localhost,formatter,threadlURL,ItemRecommend,cartviewURL, imagehomeURL,listitemflashsalelURL,listcategoryURL} from "../constants"
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import category from 'emoji-mart/dist/components/category';
import Message from "./Chat"
import SlideshowGallery from "../hocs/Slideshow"
function partition(array, n) {
    return array.length ? [array.splice(0, n)].concat(partition(array, n)) : [];
}
const int = 2;
class ImageHome extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
       items:[],list_item_recommend:[]
      };
    }
  
    componentDidMount() {
      axios.get(imagehomeURL)
      .then(res=>{
        const data = res.data;
        this.setState({items:data.c})
      })
        
    }
    navigationPrevRef = createRef()
    navigationNextRef = createRef()
    render() {
    const {items} = this.state
      return (
        <div className="section-banner-hotword--no-skin" style={{width: '1263px', marginLeft: '-31.5px'}}>
            <div className="containers d-flex">
                <div className="full-home-banners">
                    <SlideshowGallery
                        list_image={this.state.items}
                        automatic={true}
                        timeout={`2500`}
                        dot={true}
                    />
                </div>
                <div className="full-home-banners__right-wrapper">
                    <Link className="full-home-banners__right-banner" to="/m/mo-the-vib">
                        <div className="_25_r8I full-home-banners__full-height full-home-banners__light-background">
                            <div className="full-home-banners__right-banner-image _2GchKS" style={{backgroundImage: `url(https://res.cloudinary.com/dupep1afe/image/upload/v1649896459/file/6278de50db87bd29802561a48234c232_xhdpi_w9g7xz.png)`,backgroundSize:'cover',backgroundRepeat: 'no-repeat'}}></div>
                        </div>
                    </Link>
                    <Link className="full-home-banners__right-banner" to="/m/HCM-uu-dai-bat-ngo">
                        <div className="_25_r8I full-home-banners__full-height full-home-banners__light-background">
                            <div className="full-home-banners__right-banner-image _2GchKS" style={{backgroundImage: `url(https://res.cloudinary.com/dupep1afe/image/upload/v1649896458/file/1927455215e171ecbe00553ab73d9cc6_xhdpi_npvbwj.png)`,backgroundSize:'cover',backgroundRepeat: 'no-repeat'}} ></div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
      )
    }
  }

class Category extends React.Component {
    state = {
        transform: 'translate(0px, 0px)',
        error: null,
        categories:[],
    };
  
    componentDidMount() {
      axios.get(listcategoryURL)
      .then(res=>{
        this.setState({transform: 'translate(0px, 0px)',categories:partition(res.data.b, int).map(subarray => subarray)});
      })  
      .catch(err => {
        this.setState({ error: err});
      });
    }
    
    prevSlide =(e)=>{
        e.currentTarget.nextElementSibling.style.visibility='visible'
        e.currentTarget.style.visibility='hidden'
        this.setState({transform: 'translate(0px, 0px)'});
    }
    nextSlide = (e) =>{
        e.currentTarget.previousElementSibling.style.visibility='visible'
        e.currentTarget.style.visibility='hidden'
        this.setState({transform: 'translate(-360px, 0px)'});
        
    }
    render() {
    const {categories,transform}=this.state
        const remove=(e)=>{
            var array = [...this.state.categories]
            var index = array.indexOf(e.target.value)
        }
        return (
            <div className="section-category-list">
                <div className="header-section__header item-center">
                    <div className="header-section__header__title">Danh Mục</div>
                </div>
                <div className="image-carousel">
                    <div className="image-carousel__item-list-wrapper">
                        <ul className="image-carousel__item-list" style={{width: '130%', transform: transform, transition: 'all 500ms ease 0s'}}>
                           {
                            categories.map((item,i)=>
                                <li className="image-carousel__item" key={i}>
                                    <div className="home-category-list__group">
                                        {
                                        item.map(category=>
                                        <Link onClick={remove} to={category.url} key={category.title} className="home-category-list__category-grid">
                                            <div className="_5XYhbS">
                                                <div className="WCwWZw">
                                                    <div className="_25_r8I _3K5s_h">
                                                        <div className="_3K5s_h _2GchKS" style={{backgroundImage:`url(${category.image})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}></div>
                                                    </div>
                                                </div>
                                                <div className="_3DLGAG">
                                                    <div className="_13sfos">{category.title}</div>
                                                </div>
                                            </div>
                                        </Link>
                                        )}
                                    
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div onClick={this.prevSlide} className="carousel-arrow carousel-arrow--hint carousel-arrow--prev" role="button" tabIndex="0" style={{opacity: 1, visibility: 'hidden', transform: 'translateX(calc(-50% + 0px))'}}>
                        <svg enableBackground="new 0 0 13 20" viewBox="0 0 13 20" x="0" y="0" className="svg-icon icon-arrow-left-bold"><polygon points="4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9"></polygon></svg>
                    </div>
                    <div onClick={this.nextSlide} className="carousel-arrow carousel-arrow--hint carousel-arrow--next carousel-arrow--hidden" role="button" tabIndex="0" style={{opacity: 1, visibility: 'visible', transform: 'translateX(calc(50% - 0px))'}}>
                        <svg enableBackground="new 0 0 13 21" viewBox="0 0 13 21" x="0" y="0" className="svg-icon icon-arrow-right-bold"><polygon points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"></polygon></svg>
                    </div>
                </div>
            </div>
        )
    }
}
  
const Itemflashsale =()=> {
    const [state,setState]=useState({items:[],time_end:new Date(),transform:'translate(0px, 0px)',loading:false })
    const [time,setTime]=useState({hours:0,mins:0,seconds:0})
    useEffect(() => {
        const getJournal = async () => {
        await axios.get(listitemflashsalelURL)
        .then(res => {
                const data = res.data;
                const time_end=data.list_flashsale.length>0?data.list_flashsale[0].valid_to:'2022-10-10'
                setState({ ...state,loading:true,items:data.a,time_end:time_end,transform:'translate(0px, 0px)' });
                const countDown= setInterval(() => timer(), 1000);
                const  timer=()=> {
                    const FalshsaleDate = new Date(time_end);
                    const currentDate = new Date();
                    const totalSeconds = (FalshsaleDate - currentDate) / 1000;
                    setTime({hours:Math.floor(totalSeconds / 3600) % 24,
                        mins: Math.floor(totalSeconds / 60) % 60,
                        seconds:Math.floor(totalSeconds) % 60})
                    if(totalSeconds<=0){
                        clearInterval(countDown);
                    }
                }
                let hour_hexa=document.querySelector('.hour')
            })
        }
        getJournal()
    },[])

    
    
    const prevSlide =(e)=>{
        e.currentTarget.nextElementSibling.style.visibility='visible'
        e.currentTarget.style.visibility='hidden'
        this.setState({transform: 'translate(0px, 0px)'});
    }
    const nextSlide = (e) =>{
        e.currentTarget.previousElementSibling.style.visibility='visible'
        e.currentTarget.style.visibility='hidden'
        this.setState({transform: 'translate(-1000px, 0px)'});
        
    }
    const number=(num,value)=>{
        const list_number=[]
        for(let i=0;i<num;i++){
            list_number.push(
            <div style={{color:'#fff'}} className="countdown-timer__number__item">
                <span>{i}</span>
            </div>)
        }
        return list_number
    }
    const { items,transform} = state;
        return (
            <>
            {state.loading?
            <div className="flash-sale-overview-carousel">
                <div className="header-section--simple">
                    <div className="header-section__header">
                        <div className="header-section__header__title item-space">
                            <div className="flash-sale-header-with-countdown-timer__wrapper item-center">
                                <div className="flash-sale-header-with-countdown-timer__header"></div>
                                <div className="flash-sale-header-with-countdown-timer item-center">
                                    <div className="countdown-timer__number">
                                        <div className="countdown-timer__number__hexa countdown-timer__number__hexa--hour" style={{animationDelay: '-1744s',transform:`translateY(-${('0'+time.hours).slice(-2,-1)*17}px)`}}>
                                            {number(10,('0'+time.hours).slice(-2,-1))}
                                        </div>
                                        <div className="countdown-timer__number__deca countdown-timer__number__deca--hour" style={{animationDelay: '-1744s',transform:`translateY(-${('0'+time.hours).slice(-1)*17}px)`}}>
                                            {number(10,('0'+time.hours).slice(-1))} 
                                        </div>
                                    </div>
                                    <div className="countdown-timer__colon">:</div>
                                    <div className="countdown-timer__number">
                                        <div className="countdown-timer__number__hexa countdown-timer__number__hexa--minute" style={{animationDelay: '-174s',transform:`translateY(-${('0'+time.mins).slice(-2,-1)*17}px)`}}>
                                            {number(10,('0'+time.mins).slice(-2,-1))} 
                                        </div>
                                        <div className="countdown-timer__number__deca countdown-timer__number__deca--minute" style={{animationDelay: '-174s',transform:`translateY(-${('0'+time.mins).slice(-1)*17}px)`}}>
                                            {number(10,('0'+time.mins).slice(-1))}  
                                        </div>
                                    </div>
                                    <div className="countdown-timer__colon">:</div>
                                    <div className="countdown-timer__number">
                                        <div className="countdown-timer__number__hexa countdown-timer__number__hexa--second" style={{animationDelay: '-18s',transform:`translateY(-${('0'+time.seconds).slice(-2,-1)*17}px)`}}>
                                            {number(10,('0'+time.seconds).slice(-2,-1))}
                                        </div>
                                        <div className="countdown-timer__number__deca countdown-timer__number__deca--second" style={{animationDelay: '-9s',transform:`translateY(-${('0'+time.seconds).slice(-1)*17}px)`}}>
                                            {number(10,('0'+time.seconds).slice(-1))}
                                        </div>
                                    </div>
                                </div>
                            </div>   
                            <a href="" className="header-section__header-link">
                                <button className="button-no-outline">Xem tất cả&nbsp;
                                    <svg enableBackground="new 0 0 11 11" viewBox="0 0 11 11" x="0" y="0" className="svg-icon icon-arrow-right"><path d="m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z"></path></svg>
                                </button>
                            </a>
                        </div>
                    </div>
                    <div className="header-section__content">
                        <div className="image-carousel">
                            <div className="image-carousel__item-list-wrapper">                      
                                <ul style={{width: "266.667%",transform: transform,transition: "all 500ms ease 0s"}}>
                                    {
                                    items.map(item =>
                                        <li key={item.item_id} className="image-carousel__item" style={{width: "200px"}}>
                                            <div className="flash-sale-item-card flash-sale-item-card--home-page">
                                                <a className="flash-sale-item-card-link">
                                                    <div className="flash-sale-item-card__image flash-sale-item-card__image--home-page">
                                                        <div className="_2JCOmq">
                                                            <div className="flash-sale-item-card__image-overlay flash-sale-item-card__image-overlay--home-page _3LhWWQ" style={{backgroundImage:`url(${item.item_image})`,backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}></div>
                                                        </div>
                                                        <div className="_2JCOmq">
                                                            <div className="flash-sale-item-card__animated-image _3LhWWQ" style={{backgroundImage: `url(${item.item_image})`,backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flash-sale-item-card__lower-wrapper flash-sale-item-card__lower-wrapper flash-sale-item-card__lower-wrapper--home-page">
                                                        <div className="flash-sale-item-card__lower-left">
                                                            <div className="flash-sale-item-card__current-price flash-sale-item-card__current-price--home-page">
                                                                <span className="item-price-dollar-sign">₫ </span>
                                                                <span className="item-price-number">{formatter.format(((item.item_max+item.item_min)/2)*(100-item.percent_discount)/100)}</span> 
                                                            </div>
                                                            <div className="flash-sale-progress-bar__wrapper flash-sale-progress-bar__wrapper--home-page">
                                                                <div className="flash-sale-progress-bar flash-sale-progress-bar--home-page">
                                                                    <div className="flash-sale-progress-bar__text">Đã bán {item.number_order}</div>
                                                                    <div className="flash-sale-progress-bar__complement-wrapper flash-sale-progress-bar__complement-wrapper--home-page">
                                                                        <div className="flash-sale-progress-bar__complement-sizer flash-sale-progress-bar__complement-sizer--home-page" style={{width: `${(1-(item.number_order/item.quantity_limit_flash_sale))*100}%`}}>
                                                                            <div className="flash-sale-progress-bar__complement-color"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flash-sale-item-card__lower-right">
                                                        </div>
                                                        {item.percent_discount>0?
                                                        <div className="item-card__badge-wrapper fs-item-card__badge-wrapper fs-item-card__badge-wrapper--home-page">
                                                            <div className="_3e3Ul9 _63yEXc XzXrC5 badge" >
                                                                <div className="_1l5jbc">
                                                                    <span className="percent">{item.percent_discount}%</span>
                                                                    <span className="_1GDo5V">giảm</span>
                                                                </div>
                                                            </div>
                                                        </div>:''}
                                                    </div>
                                                </a>
                                            </div>
                                        </li>
                                        )
                                        }
                                    </ul>
                                </div>
                                <div onClick={()=>prevSlide()} className="carousel-arrow carousel-arrow--hint carousel-arrow--prev  carousel-arrow--hidden" role="button" tabIndex={0} style={{opacity: '1', visibility: 'hidden', transform: 'translateX(calc(-50% + 0px))'}}>
                                    <svg enableBackground="new 0 0 13 20" viewBox="0 0 13 20" x="0" y="0" className="svg-icon icon-arrow-left-bold"><polygon points="4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9"></polygon></svg>
                                </div>
                                <div onClick={()=>nextSlide()} className="carousel-arrow carousel-arrow--hint carousel-arrow--next" role="button" tabIndex={0} style={{opacity: '1',visibility: 'visible', transform: 'translateX(calc(50% - 0px))'}}>
                                    <svg enableBackground="new 0 0 13 21" viewBox="0 0 13 21" x="0" y="0" className="svg-icon icon-arrow-right-bold"><polygon points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"></polygon></svg>
                                </div>
                            </div>
                        </div>
                    </div>  
            </div>:""}
        </>
    )
}


export default class HomePage extends React.Component {
    state={items:[]}
    componentDidMount() {
        window.onscroll=()=>{
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                if(clientHeight + scrollTop == scrollHeight && this.state.items.length==0){
                axios.get(ItemRecommend)
                .then(res=>{
                    let data=res.data
                    this.setState({items:data.d});
                })  
                .catch(err => {
                    this.setState({ error: err});
                })
            }
        }
    }

    render() {
        const {items}=this.state
        return (
            <>
            <div id="main">
                <div className="_193wCc _3cVWns">
                    <div className="item-col top top--sticky">
                        <Navbar/>
                    </div>
                    <div className="home-page">
                        <div className="containers">
                        <ImageHome/>
                            <Category/>
                            <Itemflashsale/>
                            <div className="section-recommend-products-wrapper">
                            {items.length>0?
                                <div className="_25hUNg">
                                    <div className="stardust-tabs-header-anchor"></div>
                                    <nav className="stardust-tabs-header-wrapper" style={{top: '7.375rem'}}>
                                        <ul className="stardust-tabs-header">
                                            <li className="stardust-tabs-header__tab stardust-tabs-header__tab--active">
                                                <div className="_3PV6yx _3W1Hcc" style={{background: 'rgb(238, 77, 45)'}}></div>
                                                <div className="P_cEoj">
                                                    <span style={{color: 'rgb(238, 77, 45)'}}>GỢI Ý HÔM NAY</span>
                                                </div>
                                            </li>
                                            <li className="stardust-tabs-header__tab">
                                                <div className="_3PV6yx _3W1Hcc" style={{background: 'rgb(238, 77, 45)'}}></div>
                                                <div className="P_cEoj">
                                                    <img src="https://cf.shopee.vn/file/7d71045b07d8ca61a0b378c90ac3a56d" style={{width: 'auto', height: '1.25rem'}} />
                                                </div>
                                            </li>
                                        </ul>
                                        <i className="stardust-tabs-header__tab-indicator" style={{display: 'none', width: '216px', transform: 'translateX(0px)'}}></i>
                                    </nav>
                                    <div className="stardust-tabs-panels"></div>
                                    <div className="stardust-tabs-panels">
                                        <section className="stardust-tabs-panels__panel">
                                            <div className="_2O4FYU">
                                                {
                                                items.map(item=>
                                                    <div className="_2x8AVA" key={item.item_id}>
                                                        <Link to={{pathname:item.item_url}}>
                                                            <div className="_1C-0ut _3GgDBN">
                                                                <div className="_1gZS6z _1rL6dF">
                                                                    <div className="_25_r8I ggJllv">
                                                                        <img width="invalid-value" height="invalid-value" alt="Apple iPhone 12 Pro 128GB" className="_3-N5L6 _2GchKS" style={{objectFit: 'contain'}} src={item.item_image} />
                                                                        <div className="_39tdMd">
                                                                            <div className="T_lEwS _3MY8oD" style={{color:'rgb(208, 1, 27)'}}>
                                                                                <div className="_1JD7ZJ"></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="_3nkDd7">
                                                                            <div className="customized-overlay-image">
                                                                                <img src="http://localhost:8000/media/my_web/5a304484b6abd4b950c84d8bc275897b.png" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="_2x8wqR">
                                                                        <div className="_3GAFiR">
                                                                            <div className="ZG__4J">
                                                                                <div className="_10Wbs- _3IqNCf">{item.item_name}</div>
                                                                            </div>
                                                                            <div className="_11xQ9c">
                                                                                <div className="_1PWkR nt-medium nt-foot _3nkRL" style={{color: 'rgb(246, 145, 19)'}}>
                                                                                    <svg className="_2DRZW _2xFcL" viewBox="-0.5 -0.5 4 16"><path d="M4 0h-3q-1 0 -1 1a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3q0 1 1 1h3" strokeWidth="1" transform="" stroke="currentColor" fill="#f69113"></path></svg>
                                                                                    <div className="_1FKkT _3Ao0A" style={{color:'white', backgroundColor: 'rgb(246, 145, 19)'}}>{item.percent_discount}% Giảm</div>
                                                                                    <svg className="_2DRZW _2xFcL" viewBox="-0.5 -0.5 4 16"><path d="M4 0h-3q-1 0 -1 1a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3q0 1 1 1h3" strokeWidth="1" transform="rotate(180) translate(-3 -15)" stroke="currentColor" fill="#f69113"></path></svg>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="_7rV1tW _3_FVSo">
                                                                            <div className="zp9xm9 _2Dfuwn">
                                                                                <span className="_3DgLDE">₫</span>
                                                                                <span className="_19hRcI">{formatter.format((item.item_max+item.item_min)/2)}</span>
                                                                            </div>
                                                                            <div className="_1uq9fs _3yTzjb"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="item-card__hover-footer _2dFe5v">Tìm sản phẩm tương tự</div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    )
                                                }
                                            </div>
                                            <div className="_1AKybG">
                                                <Link className="btn-light btn-l btn--inline  _1J-Y2w" to="/daily_discover">Xem thêm</Link>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            :''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="modal"></div>
            <div id="mini-chat-embedded" style={{position: 'fixed', right: '8px', bottom: '0px', zIndex: 99999}}>
                <Message/>
            </div>
            </>
        );
      }
}