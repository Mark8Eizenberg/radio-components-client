import React, { useState, useEffect } from 'react';
import DropDownCard from './helpers/DropDownCard';
import { PackagesWorker } from './helpers/api/ComponentsWorker'
import { EditorCapacitor } from './radioComponentsWorkers/CapacitorWorker ';
import { EditorResistor } from './radioComponentsWorkers/ResistorWorker';

export default function RadioComponents() {

    useEffect(()=>{
        PackagesWorker.updatePackages(localStorage.token);
    },[]);
    
    return <>
        <h2 className="text-center">Radiocomponents editor</h2>
        <DropDownCard name={"Resistor"}>
            <EditorResistor/>
        </DropDownCard>
        <DropDownCard name={"Capacitor"}>
            <EditorCapacitor/>
        </DropDownCard>
        <DropDownCard name={"Chips"}></DropDownCard>
        <DropDownCard name={"Diodes"}></DropDownCard>
        <DropDownCard name={"Optocouples"}></DropDownCard>
        <DropDownCard name={"Quartzes"}></DropDownCard>
        <DropDownCard name={"Stabilizers"}></DropDownCard>
        <DropDownCard name={"Transistors"}></DropDownCard>
        <DropDownCard name={"Zener diodes"}></DropDownCard>
    </>
}