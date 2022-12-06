import { Components } from '../helpers/api/ComponentsEditorWorker'
import { CapacitorAddingModal } from './CapacitorWorker ';
import { ChipAddingModal } from './ChipWorker';
import { DiodeAddingModal } from './DiodeWorker';
import { OptocoupleAddingModal } from './OptocouplesWorker';
import { OtherAddingModal } from './OtherWorker';
import { QuartzAddingModal } from './QuartzWorker';
import { ResistorAddingModal } from './ResistorWorker';
import { StabilizerAddingModal } from './StabilizerWorker';
import { TransistorAddingModal } from './TransistorWorker';
import { ZenerDiodeAddingModal } from './ZenerDiodeWorker';

export default function AddingsComponentModalWindow({component, onAdd, onClose}){
    switch (component) {
        case Components.capacitor: return <CapacitorAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.chip: return <ChipAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.diode: return <DiodeAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.optocouple: return <OptocoupleAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.other: return <OtherAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.quartz: return <QuartzAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.resistor: return <ResistorAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.stabilizer: return <StabilizerAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.transistor: return <TransistorAddingModal onAdding={onAdd} onClose={onClose}/>
        case Components.zenerDiode: return <ZenerDiodeAddingModal onAdding={onAdd} onClose={onClose}/>
        default: return null;
    }
}