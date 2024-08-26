import React, {   useCallback, useEffect, useState } from 'react'
import NewsComponent from './NewsComponent'
import Loader from './Loader'
import '../Components/News.css'
function News({category ,Country}) {
const [articles,setArticle]=useState([])
const [loading,setLoading]=useState()
const [page, setPage]=useState(1)
const [totalresult,setresult]=useState()
   
    // our knowledge of the https
    //dekh bhai humne pehle temp namak variable mein data ka array store kiya
    //uske baad tu dekh sakta hai ky ho raha hai
 const fetchHandler=useCallback(async()=>{
     setLoading(true)
    const response= await fetch(`https://newsapi.org/v2/top-headlines?country=${Country}&category=${category}&apiKey=ca0fa20740754ef99251def94700021b&page=1&pageSize=18`)
    const data= await response.json();
    setresult(data.totalResults)
   
    const temp=data.articles
    // console.log(data);
    const article=[];
    for(const key in temp){
      article.push({
          id:key,
          title:data.articles[key].title,
          desc:data.articles[key].description,
          Imgurl:data.articles[key].urlToImage,
          URL:data.articles[key].url,
          Author:data.articles[key].author,
          Timing:data.articles[key].publishedAt,
          source:data.articles[key].source.name

      })
    }
  
    setArticle(article)
    setLoading(false)
 },[category,Country])

//better approach or say modified
// const fetchHandler = useCallback(async () => {
//   setLoading(true);

//   try {
//     const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${Country}&category=${category}&apiKey=ca0fa20740754ef99251def94700021b&page=1&pageSize=18`);
//     const data = await response.json();

//     setresult(data.totalResults);

//     const articles = data.articles.map((article, index) => ({
//       id: index,
//       title: article.title,
//       desc: article.description,
//       Imgurl: article.urlToImage || 'https://t4.ftcdn.net/jpg/04/03/95/33/360_F_403953365_suEoqiMzPXUjNpLrf9trbF5U4xeLHox0.jpg',
//       URL: article.url,
//       Author: article.author || 'Unknown',
//       Timing: article.publishedAt,
//       source: article.source.name
//     }));

//     setArticle(articles);
//   } catch (error) {
//     // Handle any errors, e.g., set an error state
//     console.error('Error fetching data:', error);
//   }

//   setLoading(false);
// }, [category, Country]);





       //we will use useEffect() for runnig the function
       //kindly remembee the syntax of calling a function in the useEffcect()
      useEffect(()=>{fetchHandler()},[fetchHandler])
  
 //for updating the further pages dynamically
 async function fetchAndUpdateArticles(newPage) {
  setLoading(true);

  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${Country}&category=${category}&apiKey=ca0fa20740754ef99251def94700021b&page=${newPage}&pageSize=18`);
    const data = await response.json();
    const articles = data.articles.map((article, index) => ({
      id: index,
      title: article.title,
      desc: article.description,
      Imgurl: article.urlToImage || 'https://t4.ftcdn.net/jpg/04/03/95/33/360_F_403953365_suEoqiMzPXUjNpLrf9trbF5U4xeLHox0.jpg',
      URL: article.url,
      Author: article.author || 'Unknown',
      Timing: article.publishedAt,
      source: article.source.name
    }));

    setArticle(articles);
  } catch (error) {
    // Handle any errors, e.g., set an error state
    console.error('Error fetching data:', error);
  }

  setLoading(false);
}

async function Nexthandler() {
  if (page + 1 > Math.ceil(totalresult / 18)) {
    // Handle when there are no more pages.
  } else {
    setPage(page + 1);
    await fetchAndUpdateArticles(page + 1);
  }
}

async function Prevhandler() {
  if (page - 1 < 1) {
    // Handle when there are no previous pages.
  } else {
    setPage(page - 1);
    await fetchAndUpdateArticles(page - 1);
  }
}

  return (
    <div className='container my-3'>
         <h2 className='text-white'>Welcome to News</h2>
        { loading?<Loader/>:
         <div className='row'>
      {articles.map((e)=>(
          <div className='col-md-4' key={e.Imgurl}>
          <NewsComponent title={e.title} Imgurl={e.Imgurl?e.Imgurl:'https://t4.ftcdn.net/jpg/04/03/95/33/360_F_403953365_suEoqiMzPXUjNpLrf9trbF5U4xeLHox0.jpg'} desc={e.desc} link={e.URL} Author={e.Author?e.Author:'Unknown'} Timing={e.Timing} source={e.source} />
               </div>
      ))}
        {/* <div className='col-md-4'>
   <NewsComponent title="This is Temp" Imgurl="" desc="check" />
        </div>
        <div className='col-md-4'>
   <NewsComponent title="This is Temp" Imgurl=""  desc="check"/>
        </div> */}
   </div> }
   {/* we have used flex box means first searched on google regarding bootstrap felxbox 
   then choose the required one then pasted in the main dev fro whoose component i have to used it */}
   <div className='container d-flex justify-content-between'>
   <button disabled={page<=1} type="button" className="btn btn-light" onClick={Prevhandler}>&larr;Previous</button>
   <button disabled={page+1>Math.ceil(totalresult/18)} type="button" className="btn btn-light" onClick={Nexthandler}>Next&rarr;</button>
   </div>
    </div>
  )
}

export default News
