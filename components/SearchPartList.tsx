import React, { memo, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";
import { FlatList, ListRenderItem, ListRenderItemInfo, Text, View, ViewStyle } from "react-native";
import { SearchItem } from "../Types";


type Props = { 
    localData:SearchItem[], 
  
    setPageNumber?:React.Dispatch<React.SetStateAction<number>>, 
    loading?:boolean,
};



let index = 0;

function SearchPartList({localData}:Props) {
    
    console.log('list rendering',index++); 
    const [page,setPage] = useState(1);
    const [data,setData] = useState(localData);
    const [loading,setLoading] = useState(false);
    const renderSearchItems = useCallback(({item}:ListRenderItemInfo<SearchItem>) => {
          return <Card {...item}  />
    },[])

 useEffect(() => {
   setData(localData);
   console.log('local data chnged');
 },[localData])
    useEffect(() => {

        if(data.length === 0)
              return;
          const fetchSearchItems = async () => {
      
         try{
          
          if(!loading){
          setLoading(true);
          console.log('searching');
          const res = await fetch(`https://airbus-project-server.vercel.app/search?q=${data[0]["Part Name"]}&page=${page}`);
          const json = await res.json();
          setData(prev => [...prev,...json]);
          setLoading(false);
          console.log('search end');
        }
            
         }catch(e){
          console.log(e);
           setLoading(false);
         }
  }
       
       fetchSearchItems();
       
    },[page]) 
     

    return (
        <>
       
       <FlatList
        className="bg-[teal] flex-1"
        data = {data}
        renderItem={renderSearchItems}
        numColumns={1}
        ItemSeparatorComponent = {() => <View className="h-4 w-full"/>}
        keyExtractor={(item) => item._id}
        onEndReached={() => { 
           if(!loading){
            console.log('page changed',page + 1);
            setPage(p => p + 1);
           }
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={ loading ? <ActivityIndicator color={'black'} animating className="my-3" /> : null}

       /> 
        
      </>
    )
}





const Card = memo((props:SearchItem) => {
    console.log('card building')
    return <View className="w-[80%] bg-rose-300 flex justify-center items-center rounded-2xl  mx-auto mt-1">
       <Text className="font-bold text-[16px] text-center mt-[10px]"> Part Name: {props["Part Name"]}  </Text>
       <Text className="font-semibold  text-[10px] ml-[10px]">  Age: {props["Age (years)"]} </Text>
       <Text className="font-medium text-[10px] ml-[10px]"> Energy Consumption for Recycle: {props["Energy Consumption - Recycled Parts (kWh)"]} kWh </Text>
       <Text className="font-medium text-[10px] ml-[10px]"> place: {props.Location} </Text>
       <Text className="font-medium text-[10px] ml-[10px]"> Energy Consumption: {props["Energy Consumption - New Parts (kWh)"]} kWh </Text>
       <Text className="font-medium text-[10px] ml-[10px]"> Energy Consumption Saved: {props["Energy Consumption Saved (kWh)"]} kWh </Text>
       <Text className="font-medium text-[10px] ml-[10px]"> Water Usage Saved: {props["Water Usage Saved (liters)"]} L </Text>
       <Text className="font-medium text-[10px] ml-[10px] mb-[10px]"> Water Usage for Recycle: {props["Water Usage - Recycled Parts (liters)"]} L </Text>
   </View>
})


 export default memo(SearchPartList);