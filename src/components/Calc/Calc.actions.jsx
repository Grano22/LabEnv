import { ActionOperation, ActionResumeOperation, TemponaryActionOperation } from 'jumper/appStateExtended';

export class CalcValueCellPreparation extends TemponaryActionOperation {

}

export class CalcRowInsert extends ActionOperation {
    onStore(component, inputData) {
        //if(component.currDocument.dimensionY<=0) component.currDocument.dimension;
        component.currDocument.dimensionX += inputData.count;
        return {  };
    }
}

export class CalcColumnInsert extends ActionOperation {
    onStore(component, inputData) {
        //if(component.currDocument.dimensionY<=0) component.currDocument.dimension;
        component.currDocument.dimensionY += inputData.count;
        return {  };
    }
}