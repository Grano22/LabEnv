import { ActionsStack, ActionOperation, ActionResumeOperation } from 'jumper/appStateExtended';

export class CreateSampleLaboratoryAction extends ActionResumeOperation {
    name = "User created a laboratory sample";
    description = "This action creates a laboratory sample";

    onStore(component, inputData) {
        component.samplesList.createSample(inputData.value);
        component.mathPatterns.updateAll(component.samplesList.toArray());
        return {};
    }

    onResume(component, inputData) {
        console.log("reworked!");
    }

    onRestore(component, inputData) {

    }
}

export class DeleteSampleLaboratoryAction extends ActionResumeOperation {
    name = "User deleted a laboratory sample";
    description = "User deleted a laboratory sample";

    onStore(component, inputData, outputData) {
        component.samplesList.deleteSample(inputData.listID);
        component.mathPatterns.updateAll(component.samplesList.toArray());
    }

    onResume() {

    }

    onRestore(component, inputData) {

    }
}

export class ChangeLaboratorySamplePositionIndex extends ActionResumeOperation {
    name = "Laboratory sample index position is #{newIndex}";
    description = "User changed a laboratory sample index position to #{newIndex}";

    onStore(component, inputData, outputData) {
        this.outputData.newIndex = component.samplesList.changeSampleIndex(inputData.lastIndex, inputData.newIndex);
        return {};
    }

    onResume() {

    }

    onRestore(component, inputData) {
        component.samplesList.changeSampleIndex(inputData.lastIndex, inputData.nextIndex);
    }
}

export class RandomizeLaboratorySampleItems extends ActionResumeOperation {
    name = "Laboratory samples randomized to values #{randomizedValues}";
    description = "";

    onStore(component, inputData) {
        component.samplesList.randomizeSamples(inputData.fromValue, inputData.toValue, inputData.minItems, inputData.maxItems);
        component.mathPatterns.updateAll(component.samplesList.toArray());
    }
}

export class SortByIndexes extends ActionResumeOperation {
    name = "User sorted smaples by their indexes";
    description = "";

    onStore(component) {
        component.samplesList.sortByIndexes();
    }
}

export class PrepareItemsIndexesToPositions extends ActionResumeOperation {
    name = "User changed samples indexes to positions";
    description = "";

    onStore(component) {
        component.samplesList.setPositionsToIndexes();
    }
}

export class ImportSamplesItems extends ActionResumeOperation {
    name = "User imported a samples";
    description = "";

    onStore(component, inputData) {
        component.samplesList.toImportData(inputData.fileType, inputData.fileResource);
    }

    onResume() {
        
    }
}

export class SelectOutputTypeToAdd extends ActionResumeOperation {
    name = "User added a output data type #{type}";
    description = "User added a output data type to set";

    onStore(component, inputData) {
        component.mathPatterns.createDataset(inputData.selectedFormula, component.samplesList.toArray());
        console.log(component.mathPatterns);
        return { type:inputData.selectedFormula };
    }

    onResume() {
        console.log("reworked!");
    }

    onFlush() {

    }
}

export class ChangeOutputLaboratorySamplePosition extends ActionResumeOperation {
    name = "User changed an output data index to #{newIndex}";
    description = ""

    onStore(component, inputData) {
        component.mathPatterns.changeIndex(inputData.lastIndex, inputData.newIndex);
    }
}

export class DeleteOutput extends ActionResumeOperation {
    name = "User deleted an output";
    description = "";

    onStore(component, inputData) {
        component.mathPatterns.deleteDataset(inputData.lastIndex);
    }
}