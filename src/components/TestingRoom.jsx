import { useState, useEffect, useRef } from "react";
import SliderRange from "./helpers/SliderRange";

export default function TestRoom(){

    return <>
        <h1>Test room used only for testing, DELETE IN PROD</h1>
        <h1>SLIDER</h1>
        <SliderRange min={0} max={100} onChange={(args)=>{console.log(args)}}/>
    </>
}