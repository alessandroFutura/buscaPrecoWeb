import React,{ useState, useEffect} from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

import './App.css';
import api from '../services/api'
import Image from '../assets/empty.png'
import Modal from '../components/modal'


function App() {
  const [time, setTime ] = useState();
  const [input, setInput] = useState('');
  const [slide, setSlide] = useState([]);
  const [product , setProduct] = useState({});
  const [priceValue, setPriceValue] = useState('');
  const [seconds, setSeconds] = useState(30 * 1000); // 1 minute
  const [updateTime, setUpdateTime] = useState( 60 * 5000); // 15 minutos
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [token, setToken] = useState('r0zUBn6o7tbggzZQXCusGT2DUPJ4wHF3');

  async function getPrice (ret){
     if(ret == 13){
        let data = {
          token:token,
          eanCode:input,
        }
        try {
          const response = await api.post('priceSearch.php?action=get', data);
          const ret = response.data.data;
          let CurrencyPrice = parseFloat(ret.VlPreco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          setProduct(ret)
          setPriceValue(CurrencyPrice);
          //setInput("");
        } catch (error) {
          console.error(error);
          setIsVisibleModal(true);
          setInput("");
          setProduct({});
          setPriceValue('');
          setTimeout(() => {
            setIsVisibleModal(false);
          }, 3000);
        }
     }
  }
  
  async function getSlide (){
    let data = {
      token:token,
      image_end_date: 1,
      image_active: 'Y',
      image_start_date: 1,
      image_section: 'price',
    };
    try {
      const response = await api.post('api/image.php?action=getList', data);
      const ret = response.data.data;
      setSlide(ret);
      slideRefresh();
    } catch (error) {
      console.error(error);
    }
  }
  const Counter = ()=>{
    setTime(setTimeout(()=>{
        setInput("");
        setProduct({});
        setPriceValue('');
    }, seconds));
 
  } 

  const slideRefresh = ()=>{
    setTime(setTimeout(()=>{
      getSlide();
    }, updateTime));
  }

  useEffect(()=>{
    clearTimeout(time);
    Counter();
  },[product]);

  useEffect(()=>{
    getSlide();
  },[]);


  return (
    <div className="container">      
        <header className='panelHeader'>
          <h1>SEJA BEM VINDO A DAFEL</h1>
          <h2>É UM PRAZER PARA NÓS TER VOCÊ COMO NOSSO CLIENTE</h2>
        </header>
        <span className='Title01'>NOSSAS PROMOÇÕES</span>
        <div className='MediaSlider'>
            <Fade
              arrows={false}
            >
                {slide.map((img, index) => (
                  <div className="each-fade" key={index}>
                    <div className="image-container">
                      <img src={img.image_large} />
                    </div>
                  </div>
                ))}
            </Fade>
        </div>
        <span className='Title02'>CONSULTA PREÇO</span>
        <footer className='PanelFooter'>
          {isVisibleModal &&
              <Modal/>
          }{!isVisibleModal &&
            <>
               <div className='SearchTitle'>
                  APROXIME O PRODUTO E APONTE O CÓDIGO DE BARRAS PARA O LEITOR ABAIXO
              </div>
              <div className='SearchForm'> 
                <img className='Image' src={ product.image || Image}/>
                <div className='SearchInfo'>
                  <div className='details01'>
                    <div className='Left'>
                        <div className='row1'>
                          <div className='GroupInput'>
                            <label>CÓDIGO</label>
                            <span>{product.CdChamada}</span>
                          </div>
                          <div className='GroupInput'>
                            <label>CÓDIGO DE BARRAS</label>
                            <input 
                              autoFocus
                              value={input}
                              type="numeric" 
                              className="InputCode" 
                              placeholder='' 
                              onChange={(event)=>{setInput(event.target.value); if(event.target.value.length == 13){event.target.select()}}}
                              onKeyUp={(e)=>{getPrice(e.keyCode)}}
                              maxLength={13}
                            />
                          </div>
                        </div>    
                        <div className='row2'>
                            <div className='GroupInput2'>
                                <label >DESCRIÇÃO</label>
                                <span className='Name'>{product.NmProduto}</span>
                            </div>
                        </div>    
                    </div>
                    <div className='Right'>
                        <div className='GroupInput3'>
                            <label>VALOR</label>
                            <span >
                              <small className='LabelPrice'>R$</small>
                              <small className='Price'>{priceValue}</small>
                            </span>
                        </div>
                    </div>
                  </div>
                  <div className='details02'>
                    <span>PARA MAIORES INFORMAÇÕES PROCURE UM DE NOSSOS REPRESENTANTES</span>
                    <small>IMAGENS DO PRODUTO MERAMENTE ILUSTRATIVA</small>
                  </div>
                </div>
              </div>  
            </>
          }
        </footer>
    </div>
  );
}

export default App;