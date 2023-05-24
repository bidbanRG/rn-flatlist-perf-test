import {  useEffect, useState } from 'react';

import {  View,TextInput, Text, Platform, StatusBar } from 'react-native';
import  SearchPartList  from './components/SearchPartList';
import { SearchItem } from './Types';

const controller = new AbortController();
const signal = controller.signal;

export default function App() {

   const [searchItems,setSearchItems] = useState<SearchItem[]>([]);
   const [search, setSearch] = useState('');
   const [pageNumber,setPageNumber] = useState(1);
   const [loading,setLoading] = useState(false);
    
    


   useEffect(()=>{
       
       if(search.length === 0){
         
         setSearchItems([]);
         setLoading(false);
         return; 
       }
       if(searchItems.length > 0 && searchItems[0]['Part Name'].substring(0,search.length) === search)
         return;
        // if(loading)
        //   { controller.abort(),console.log('abort');}
      
       
       const fetchSearchItems = async () => {
      
         

         
        try{
          
          // if(loading)
          //   { controller.abort(),console.log('abort');} 
         
         
          setLoading(true);
          const res = await fetch(`https://airbus-project-server.vercel.app/search?q=${search}`,{signal});
          const json = await res.json();
          setSearchItems(json);
          setLoading(false);
         
            
         }catch(e){
          console.log(e);
           setLoading(false);
         }
  }
       
       fetchSearchItems();
       
      // return () => {
      //   controller.abort(); 
      //    setLoading(false);
      //   console.log('aborted');     
      // }

  },[search])

  return (
    <View className={`flex-1 bg-gray-400 mt-[${Platform.OS === 'android' ? StatusBar.currentHeight : 0 }px]`}>
      <Text className='text-[20px] font-bold text-black mt-10 ml-3' > Air Parts  </Text>
      <TextInput 
        className='w-[90%] h-[60px] mx-auto rounded-[10px] border-4 border-[teal] mt-4 text-black p-2 text-[20px]'
        cursorColor={'black'}
        onChangeText={setSearch}
        placeholder={'search...'}
        placeholderTextColor={'gray'}
      />
      <SearchPartList  localData = {searchItems} />
    </View>
  );
}


