"use strict"

var cdniverse = "https://storage.googleapis.com/cdniverse/" //const may conflict


function hello()
{
    alert("Hello, local AI  world!")
}

function showPopoverWithContent(s)
{
    const pop = document.createElement("div");
    pop.insertAdjacentHTML("afterbegin", s)
    pop.className = "my-popover"
    pop.setAttribute("popover", "auto") // enable popover behavior
    document.body.appendChild(pop)
    pop.showPopover()
}

function formatBytes(bytes, decimals = 2)
{
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // or 1000 for metric
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}


//-----------------------------------------------------------------
function update_localAIbaseline_mainTable(numView = 0)
{
    let s = menuSelectModelType(numView)


    document.getElementById("localAIbaseline_mainTable").innerHTML = s

}
//-----------------------------------------------------------------
function menuSelectModelType(numView = 0, uuid = "") {
    const type = ModelOfMyLLMroot.map_uuid_to_modelType.get(uuid)

    let s = ""

    let num = 0
    for (let label of ["beta testers", "under construction"]) {
        s += "<label>&nbsp;<input type='radio' onClick='MyLLMroot.showLLmsUnderConstruction=" + num + ";ModelOfMyLLMroot.selectThisType();' name='radios_choose_under_construction' " + (MyLLMroot.showLLmsUnderConstruction === num ? "checked" : "") + ">&nbsp;" + TLtranslateFromTo(label) + "&nbsp;</label>"
        num++
    }

    let select = "<select onClick='event.stopPropagation()' onChange='ModelOfMyLLMroot.selectThisType(\"" + uuid + "\", this.value);" + close + "'>"
    for (let [name, modelOfMyLLM] of ModelOfMyLLMroot.modelTypes)
        select += "<option value='" + name + "' " + (name == type ? "select" : "") + ">" + name + "</option>"
    select += "</select>"

    s += "<br><br>" + select + " &nbsp; "
    for (let [name, modelOfMyLLM] of ModelOfMyLLMroot.modelTypes)
        s += "&nbsp;<button onClick='if(!ModelOfMyLLMroot.selectThisType(\"" + uuid + "\",\"" + name + "\"))" + close + " '>" + name + "</button>&nbsp;"

    s += "<br><br>"
    const titles = ["engines", "models"]
    for(let n = 0; n < titles.length; n++)
        s += "<label> &nbsp; <input onClick='update_localAIbaseline_mainTable(" + n + ")' type='radio' "+ (numView === n ? "checked" : "") +" name='radios_engines_models' style='margin-bottom:6px'>&nbsp;" + TLtranslateFromTo(titles[n]) + "&nbsp;</label>"

    if (numView === 0)
    {

    //TABLE 1
    s += "<br><table border='1'><tr>"
        + "<td colspan=3>" + TLtranslateFromTo("engines") + " / " + TLtranslateFromTo("models") + "</td>"
    for (let [name, modelOfMyLLM] of ModelNameLLM.mapNameToModels)
        s += "<td>" + modelOfMyLLM.icon("25px") + "</td>"
    s += "</tr>"

    for (let [name, llm] of MyLLMroot.mapMyLLMs) {
        s += "<tr class='table_with_all_llm_" + llm.uniqueID + " back_ground_color_availability_" + llm.uniqueID + "' style='background-color:" + llm.rowColor() + "'>"
            + "<td style='border-right:1px solid #fff'>" + llm.localORcloudORsharedAIicon("24px") + "</td>"
            + "<td style='border-right:1px solid #fff" + llm.addToBackgroundImage() + "'>" + llm.icon("20px") + "</td>"
            + "<td style='text-align:left;border-left:1px solid #fff'>" + llm.name + "</td>"
        for (let [name, modelOfMyLLM] of ModelNameLLM.mapNameToModels)
        {
            const numModelsOfLLM = llm.numModelsOfLLM(modelOfMyLLM)
            s += "<td onClick='LocalAIbaseline.MyLLMroot.calculate_llmID_modelName(\""+llm.uniqueID+"\",\""+modelOfMyLLM.name+"\")' class='numModelsOfLLM_modelOfMyLLM_" + llm.uniqueID+"\"' class='numModelsOfLLM_modelOfMyLLM_" + llm.uniqueID + "_" + modelOfMyLLM.name + "' style='" + (numModelsOfLLM ? "cursor:pointer" : "") + "'>" + (numModelsOfLLM || "") + "</td>"
        }
        s += "</tr>"
    }


    s += "</table>"

    }
    else if(numView === 1)
    {
    //TABLE 2
    s += "<br><table border='1'><tr>"
        + "<td colspan=2 rowspan=2>" + TLtranslateFromTo("models") + "<br>" + TLtranslateFromTo("engines") + "</td>"
    for (let [name, llm] of MyLLMroot.mapMyLLMs)
        s += "<td class='table_with_all_llm_" + llm.uniqueID + "' style='background-color:" + llm.rowColor() + "'>" + llm.localORcloudORsharedAIicon("24px") + "</td>"
    s += "</tr><tr>"
    for (let [name, llm] of MyLLMroot.mapMyLLMs)
        s += "<td class='table_with_all_llm_" + llm.uniqueID + "' style='background-color:" + llm.rowColor() + llm.addToBackgroundImage() + "'>" + llm.icon("25px") + "</td>"
    s += "</tr>"

    for (let [name, modelOfMyLLM] of ModelNameLLM.mapNameToModels) {
        s += "<tr>"
            + "<td style='border-right:1px solid #fff'>" + modelOfMyLLM.icon("20px") + "</td><td style='text-align:left;border-left:1px solid #fff'>" + modelOfMyLLM.name + "</td>"
        for (let [name, llm] of MyLLMroot.mapMyLLMs)
            s += "<td onClick='LocalAIbaseline.MyLLMroot.calculate_llmID_modelName(\""+llm.uniqueID+"\",\""+modelOfMyLLM.name+"\")' class='table_with_all_llm_" + llm.uniqueID + "' style='background-color:" + llm.rowColor() + "'>" + (llm.numModelsOfLLM(modelOfMyLLM) || "") + "</td>"

        s += "</tr>"
    }
    s += "</table>"
    }

    s += "<br><table style='margin-top:6px'><tr>"
    for (let i = 0; i < MyLLMroot.LLMreadinessStates.length; i++)
        s += "<td style='background-color:" + MyLLMroot.LLMreadinessStateBKcolors[i] + "'>&nbsp; " + TLtranslateFromTo(MyLLMroot.LLMreadinessStates[i]) + " &nbsp;</td>"
    s += "</tr></table>"

    //s += "<br>" + MyLLMroot.showOffLocalAIandCloudAI("30px", "16px", " &nbsp;");

    return s
}
//--------------------------------------------------------------
class MyLLMroot
{
    static mapIDtoMyLLMs = new Map()
    static mapNameToMyLLMs = new Map()
    static mapMyLLMs = new Map()
    static mapMyLocalLLMs = new Map()
    static mapMyCloudLLMs = new Map()

    static STATE_AVAILABILITY_GOOD = 0
    static STATE_AVAILABILITY_READY = 1
    static STATE_AVAILABILITY_AVAILABLE = 2
    static STATE_AVAILABILITY_UNAVAILABLE = 3
    static LLMreadinessStates = ["good", "ready", "available", "unavailable"]
    static LLMreadinessStateBKcolors = ["#fff", "#dfd", "#ffc", "#fdd"]

    static initialized = false

    static activeLLM
    static activeModelOfLLM


    static mapUUIDtoChatPlaces_obj = new Map()
    static showLLmsUnderConstruction = 0 //0 use     1 under construction

    name = "LLM root"
    image = ""
    selectedModel = ""
    underConstruction = true
    active = false
    availability = MyLLMroot.STATE_AVAILABILITY_UNAVAILABLE //unavailable

    constructor(uniqueID, name, imageURL, siteURL = "https://aimagazine.com/articles/top-10-ai-cloud-platforms")
    {
        this.uniqueID = uniqueID
        this.name = name
        this.image = cdniverse + imageURL
        this.siteURL = siteURL
        this.costPerMillionTokenIn = 10
        this.costPerMillionTokenOut = 10
        MyLLMroot.mapNameToMyLLMs.set(this.name, this)
        MyLLMroot.mapIDtoMyLLMs.set(uniqueID, this)
        MyLLMroot.mapMyLLMs.set(this.name, this)
        this.models = new Map()
    }

 //----------------------------------------
    static initialize() {
        if (MyLLMroot.initialized)
            return
        MyLLMroot.initialized = true
        new MyWebLLM()
        new MyTransformersJS()
        new MyMediaPipe()
        new MyChromeBuiltInAI()
        new MyAppleIntelligence()
        new MyTensorFlowJS()
        new MyONNX()

        new MyChatGPT_key()
        new MyGemini_key()
//CORS policy ERRORS
        new MyPerplexity_key()
        new MyAnthropic_key()
        new MyGroq_key()

        new ModelNameLLM(ModelOfMyLLMroot.MODEL_META, "Meta", "llama-meta.webp")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_DEEPSEEK, "High-Flyer", "deepseek-blue-logo-symbol-25654.svg")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_QWEN, "Alibaba Cloud", "Qwen_logo.svg")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_GEMMA, "Google Deepmind", "gemma-seeklogo.svg")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_SONAR, "Perplexity", "sonar_by_perplexity.png")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_CLAUDE, "Anthropic", "claude-ai-icon.svg")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_GPT, "OpenAI", "chatgpt-6.svg")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_LIQUID, "Liquid AI", "liquid.svg")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_GEMINI, "Gemini", "google-gemini-icon.svg")
        new ModelNameLLM(ModelOfMyLLMroot.MODEL_APPLE_FM, "Apple FM", "Apple_Intelligence.svg")

    ModelType.modelTypeAll = new ModelType(ModelOfMyLLMroot.MODEL_TYPE_ALL, "", false)
    ModelType.modelTypeChat = new ModelType(ModelOfMyLLMroot.MODEL_TYPE_CHAT, "chat", false)
    ModelType.modelTypeSummary = new ModelType(ModelOfMyLLMroot.MODEL_TYPE_SUMMARY, "summarizing", true, 1, 1, 2)
    ModelType.modelTypeImageRecognition = new ModelType(ModelOfMyLLMroot.MODEL_TYPE_IMAGE_RECOGNITION, "image recognition", true, 1, 1, 2)
    ModelType.modelTypeImageGeneration = new ModelType(ModelOfMyLLMroot.MODEL_TYPE_IMAGE_GENERATION, "image generation", false)

    }

//---------------------------------------
    addModelsFromArray(arr) {
        for (let modelOfLLM of arr) {
            if (!this.selectedModel)
                this.selectedModel = modelOfLLM
            this.addModel(modelOfLLM.id, modelOfLLM)
        }
    }

//---------------------------------------
    addModel(modelID, modelInfo) {
        this.models.set(modelID, modelInfo)
    }

//----------------------------------------
    modelSelectHTML() {
        let s = "<select onChange='MyLLMroot.command(\"SET_MODEL\", \"" + this.name + "\", this.value)''>"
        for (let [id, model] of this.models)
            s += "<option value='" + model.id + "'" + (model.id == this.selectedModel ? "selected" : "") + ">" + model.name + "</option>"
        s += "</select>"
        return s
    }
//----------------------------------------
    numModelsOfLLM(modelOfMyLLM) {
        let num = 0
        for (let [name, model] of this.models)
            if (model.family === modelOfMyLLM.name)
                num++
        return num
    }
//----------------------------------------
    modelsOfLLMwithName(modelOfMyLLM_name) {
        let arr = []
        for (let [name, model] of this.models)
            if (model.family === modelOfMyLLM_name)
                arr.push(model)
        return arr
    }
//----------------------------------------
    localORcloudORsharedAIicon(height = "30px") {
        if (this instanceof MyLocalLLMroot)
            return MyLLMroot.localAIicon(height)
        else if (this instanceof MyCloudLLMroot)
            return MyLLMroot.cloudAIicon(height)
        else if (this instanceof MySharedLLMroot)
            return MyLLMroot.sharedAIicon(height)
    }
//---------------------------------------------------------------
    static localAIicon(height = "30px") {
        return "<img src='" + cdniverse + "ChatPlaces/LocalAI.svg' style='height:" + height + "'>"
    }

//---------------------------------------------------------------
    static cloudAIicon(height = "30px") {
        return "<img src='" + cdniverse + "ChatPlaces/CloudAI.svg' style='height:" + height + "'>"
    }

//---------------------------------------------------------------
    static sharedAIicon(height = "30px") {
        return "<img src='" + cdniverse + "ChatPlaces/SharedAI.svg' style='height:" + height + "'>"
    }
//--------------------------------------------------------------------------------------------------------
    addToBackgroundImage() {
        return ""
    }
//-------------------------------------------
rowColor()
{
    return "#fff"
}
//----------------------------------------
    icon(height = "30px") {
        return "<img src='" + this.image + "' style='height:" + height + "' title='" + this.name + "'>"
    }
//----------------------------------------
static calculate_llmID_modelName(llm_uniqueID, modelOfMyLLM_name)
{
    const llm = MyLLMroot.mapIDtoMyLLMs.get(llm_uniqueID)
    const arrayOfModels = llm.modelsOfLLMwithName(modelOfMyLLM_name)
    if(arrayOfModels.length === 0)
        alert("no models of llm")
    else if(arrayOfModels.length === 1)
        LocalAIbaseline.MyLLMroot.calculateMenu_llm_model(llm_uniqueID, arrayOfModels[0].id)
    else
    {
        let s = "<table><tr><th colspan='2'>choose model</th></tr>"
        for(let modelOfMyLLM of arrayOfModels)
            s += "<tr onClick='LocalAIbaseline.MyLLMroot.calculateMenu_llm_model(\""+llm_uniqueID+"\",\"" + modelOfMyLLM.id + "\")' style='cursor:pointer'>"
                + "<td>" + modelOfMyLLM.icon("20px") + "</td>"
                + "<td style='text-align:left'>" + modelOfMyLLM.name + "</td>"
                + "</tr>"
        s += "</table>"
        showPopoverWithContent(s)
    }
}
//----------------------------------------
static async calculateMenu_llm_model(llm_uniqueID, modelOfMyLLM_id)
{

const result = await navigator.storage.estimate()
const memorySizeForOriginPrivateFileSystem = result.quota

const llm = MyLLMroot.mapIDtoMyLLMs.get(llm_uniqueID)
const model = llm.models.get(modelOfMyLLM_id)

let s = "<table style='width:100%'><tr><th style='width:1px'>" + llm.icon() + "</th><th style='text-align:left'>"+ llm.name +"</th><th>&nbsp;+&nbsp;</th><th style='text-align:right'>" + model.name + "</th><th style='width:1px'>" + model.icon("30px") + "</th></tr></table>"

    s += "<center><table>"
       + "<tr><td>Memory</td><td> <input type='number' disabled value='"+navigator.deviceMemory+"' style='width:40px' title='aproximated to avoid device fingerprinting'> GBytes</td></tr>"
       + "<tr><td>manual</td><td><input type='number' style='width:40px'> GBytes</td></tr>"
       + "<tr><td>Disk</td><td>"+formatBytes(memorySizeForOriginPrivateFileSystem)+"</td></tr>"
       + "<tr><td>Loading first time</td><td>no data</td></tr>"
       + "<tr><td>Loading second time</td><td>no data</td></tr>"
       + "<tr><td>First char received</td><td>no data</td></tr>"
       + "<tr><td>Last char received</td><td>no data</td></tr>"

       + "</table>"
       + "<br>"
       + "<button onClick='calculateTimes(\"" + llm_uniqueID + "\",\"" + modelOfMyLLM_id + "\")' style='margin-bottom:6px'>" + TLtranslateFromTo("calculate") +"</button>"
       + " &nbsp; <button style='margin-bottom:6px'>" + TLtranslateFromTo("post local AI Baseline data") +"</button>"
       + "</center>"
showPopoverWithContent(s)

}
//
}//class MyLLMroot

//--------------------------------------------------------------------------------------------------------

class MyLocalLLMroot extends MyLLMroot {
    static localLLMs_enabled = true
    static selectedLocalMyLLMname = "WebLLM"

    constructor(uniqueID, name, imageURL, siteURL) {
        super(uniqueID, name, imageURL, siteURL)
        this.availability = MyLLMroot.STATE_AVAILABILITY_READY
        this.uniqueID = uniqueID
        this.responseStreaming = false
        MyLLMroot.mapMyLocalLLMs.set(name, this)
    }
} //class MyLocalLLMroot

//------------------------------------------------------------
class MyWebLLM extends MyLocalLLMroot {
    static myWebLLM
    // https://scribbler.live/2024/10/02/Large-Language-Models-in-the-Browser-with-WebLLM.html
    //     const webllm = await await_import("https://esm.run/@mlc-ai/web-llm")

    constructor() {
        super("ID_WEBLLM", "WebLLM", "AI/WebLLM_logo.jpg")
        MyWebLLM.myWebLLM = this
        this.underConstruction = false
        this.responseStreaming = true

        // read https://github.com/mlc-ai/web-llm/blob/main/src/config.ts#L293 and present choices!
        this.addModelsFromArray([
            //  https://huggingface.co/mlc-ai
            new ModelOfMyLLMroot(MyWebLLM.myWebLLM, "Llama-3.2-1B-Instruct-q4f32_1-MLC", "Llama 3.2-1B Instruct", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_META)
            , new ModelOfMyLLMroot(MyWebLLM.myWebLLM, "Llama-3.1-8B-Instruct-q4f32_1-MLC", "Llama 3.1-8B Instruct", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_META)
            , new ModelOfMyLLMroot(MyWebLLM.myWebLLM, "DeepSeek-R1-Distill-Qwen-7B-q4f32_1-MLC", "DeepSeek R1 Distill Qwen 7B", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_DEEPSEEK)
            //, "gemma-2-2b-it-q4f16_1-MLC Gemma2 2B" // VRAM 1895.3
            //, "Qwen2.5-0.5B-Instruct-q4f16_1-MLC QWEN 2.5 0.5B 16 bits" // VRAM 944Mb

            /*, "DeepSeek-R1-Distill-Llama-8B-q4f32_1-MLC"
            , "DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC"
            , "Hermes-2-Theta-Llama-3-8B-q4f16_1-MLC"
            , "Hermes-2-Theta-Llama-3-8B-q4f32_1-MLC"
            , "Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC"
            , "Hermes-2-Pro-Llama-3-8B-q4f32_1-MLC"
            , "Hermes-3-Llama-3.2-3B-q4f32_1-MLC"
            , "Hermes-3-Llama-3.2-3B-q4f16_1-MLC"
            , "Hermes-3-Llama-3.1-8B-q4f32_1-MLC"
            , "Hermes-3-Llama-3.1-8B-q4f16_1-MLC"
            , "Hermes-2-Pro-Mistral-7B-q4f16_1-MLC"
            , "Phi-3.5-mini-instruct-q4f16_1-MLC"
            , "Phi-3.5-mini-instruct-q4f32_1-MLC"
            , "Phi-3.5-mini-instruct-q4f32_1-MLC-1k"
            , "Phi-3.5-vision-instruct-q4f16_1-MLC"
            , "Mistral-7B-Instruct-v0.3-q4f16_1-MLC"
            , "OpenHermes-2.5-Mistral-7B-q4f16_1-MLC"
            , "WizardMath-7B-V1.1-q4f16_1-MLC"
            , "Qwen2.5-0.5B-Instruct-q4f16_1-MLC"

             */
        ])
    }
} //class MyWebLLM


//------------------------------------------------------------
class MyTransformersJS extends MyLocalLLMroot {
    static myTransformersJS

    constructor() {
        super("ID_TRANS_JS", "TransformersJS", "AI/huggingface_logo.svg")
        MyTransformersJS.myTransformersJS = this
        this.underConstruction = false

        // read https://github.com/mlc-ai/web-llm/blob/main/src/config.ts#L293 and present choices!
        this.addModelsFromArray([
            //in https://huggingface.co/models filter for public models  libraries:TransformersJS
            //"Xenova/gemma-2-9b-it-quantized",

            // models for "text-generation" pipeline

            //FAILED TO FETCH "onnx-community/Llama-3.2-1B-Instruct TEST"
            //"google/flan-t5-small TEST" //unsupported model type
            //"google/flan-t5-small TEST"  //not found
            new ModelOfMyLLMroot(MyTransformersJS.myTransformersJS, "onnx-community/Qwen3-0.6B-ONNX", "Qwen3-0.6B", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_QWEN)
            , new ModelOfMyLLMroot(MyTransformersJS.myTransformersJS, "onnx-community/Qwen2.5-0.5B-Instruct", "Qwen2.5-0.5B", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_QWEN)
            , new ModelOfMyLLMroot(MyTransformersJS.myTransformersJS, "onnx-community/LFM2-350M-ONNX", "Liquid AI 350M", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_LIQUID)
            , new ModelOfMyLLMroot(MyTransformersJS.myTransformersJS, "onnx-community/dinov3-vits16-pretrain-lvd1689m-ONNX", "DINOv3 vits16", ModelOfMyLLMroot.MODEL_TYPE_IMAGE_RECOGNITION, ModelOfMyLLMroot.MODEL_META)

        ])
    }
} //class MyTransformersJS



//------------------------------------------------------------
class MyMediaPipe extends MyLocalLLMroot {
    static modelFileNameRemote = //cdniverse + "AI/models/gemma2-2b-it-gpu-int8.bin" //
        'https://storage.googleapis.com/jmstore/WebAIDemos/models/Gemma2/gemma2-2b-it-gpu-int8.bin';
    static modelFileName = 'http://localhost/gemma2-2b-it-gpu-int8.bin';
    static CHAT_PERSONA_NAME = 'chatPersona';
    static API_PERSONA_NAME = 'apiPersona';
    static CHAT_PERSONA_HISTORY = [];
    static API_PERSONA_HISTORY = [];

    static myMediaPipe

    constructor() {
        super("ID_MEDIAPIPE", "MediaPipe", "AI/mediapipe_icon.svg")
        MyMediaPipe.myMediaPipe = this
        this.underConstruction = false

        // read https://github.com/mlc-ai/web-llm/blob/main/src/config.ts#L293 and present choices!
        this.addModelsFromArray([    //  https://huggingface.co/mlc-ai
            new ModelOfMyLLMroot(MyMediaPipe.myMediaPipe, "gemma-2b-it-gpu-int8.bin", "Gemma-2b Instruct", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_GEMMA)

        ])
    }
}// class MyMediaPipe


//---------------------------------------------------------------
class MyChromeBuiltInAI extends MyLocalLLMroot {
    constructor() {
        super("ID_CHROMEAI", "Chrome AI", "AI/chrome_logo_social_social media_icon.svg")
        MyChromeBuiltInAI.myChromeBuiltInAI = this
        this.underConstruction = false
        this.responseStreaming = false //true does not work yet...
        if (!('Summarizer' in self))   //does not work !window.ai)
            this.availability = MyLLMroot.STATE_AVAILABILITY_UNAVAILABLE //unavailabe

        // read https://github.com/mlc-ai/web-llm/blob/main/src/config.ts#L293 and present choices!
        this.addModelsFromArray([    //  https://huggingface.co/mlc-ai
            new ModelOfMyLLMroot(MyChromeBuiltInAI.myChromeBuiltInAI, "gemini_nano", "Gemini Nano", ModelOfMyLLMroot.MODEL_TYPE_SUMMARY, ModelOfMyLLMroot.MODEL_GEMINI)

        ])
    }
}//class MyChromeBuiltInAI

//---------------------------------------------------------------
class MyAppleIntelligence extends MyLocalLLMroot
{
    constructor () {
        super("ID_APPLE_INTELLIGENCE", "Apple Intelligence", "AI/apple-seeklogo.svg")
        MyAppleIntelligence.myAppleIntelligence = this
        this.underConstruction = false
        //if(!('Summarizer' in self))   //does not work !window.ai)
        this.availability = MyLLMroot.STATE_AVAILABILITY_UNAVAILABLE //unavailabe
        //ONLY AVAILABLE IN App accessing the built in browser (bridge Swift - JavaScript - Swift)

        // Writing tools: rewriting, proofreading, summarizing, tone adjustment.
        // Notification summarization, organizing emails, visual understanding, creative image generation ("Genmoji", Image Playground).

        this.addModelsFromArray([    //  https://huggingface.co/mlc-ai
            new ModelOfMyLLMroot(MyAppleIntelligence.myAppleIntelligence, "apple_foundation_models", "Apple Foundation Models", ModelOfMyLLMroot.MODEL_TYPE_SUMMARY, ModelOfMyLLMroot.MODEL_APPLE_FM)
            , new ModelOfMyLLMroot(MyAppleIntelligence.myAppleIntelligence, "apple_foundation_models", "Apple Foundation Models", ModelOfMyLLMroot.MODEL_TYPE_IMAGE_GENERATION, ModelOfMyLLMroot.MODEL_APPLE_FM)

        ])
    }
//------------------------------------------------------------
   }
//------------------------------------------------------------
class MyTensorFlowJS extends MyLocalLLMroot
{
    constructor ()
    {
        super("ID_TENSORFLOWJS", "TensorFlowJS", "AI/TensorFlow.svg")
   }
} // class MyTensorFlowJS
//------------------------------------------------------------
class MyONNX extends MyLocalLLMroot
{
    constructor ()
    {
        super("ID_ONNXJS", "ONNX JS", "AI/onnxai_logo.svg")
    }
} // class MyONNX


//------------------------------------------------------------
class MyCloudLLMroot extends MyLLMroot {
    static mapOnlyTHisID_to_lastS_listCloudAPIkeysHTML = new Map()
    static baseApps = new Set();

    constructor(uniqueID, name_param, imageURL, siteURL) {
        super(uniqueID, name_param, imageURL, siteURL)

        this.availability = MyLLMroot.STATE_AVAILABILITY_AVAILABLE

        MyLLMroot.mapMyCloudLLMs.set(this.name, this)
    }
//-------------------------------------------
    releaseMemory() {
        //in principle nothing to release for heavy memory use is in the cloud
    }

//-------------------------------------------
    localORcloudString() {
        return "CLOUD"
    }

//-------------------------------------------
    rowColor() {
        return "#ffc" //change to green if has API key
    }
} // class MyCloudLLMroot


//------------------------------------------------------------
class MyChatGPT_key extends MyCloudLLMroot {
    static myChatGPT_key

    constructor() {
        super("ID_CHATGPT_KEY", "ChatGPT", "AI/chatgpt-6.svg", "https://chatgpt.com/")
        this.costPerMillionTokenIn = 1.25
        this.costPerMillionTokenOut = 10
        MyChatGPT_key.myChatGPT_key = this
        this.underConstruction = false
        this.modelForVercelAI = 'gpt-4o-mini'
        this.addModelsFromArray([
            new ModelOfMyLLMroot(MyChatGPT_key.myChatGPT_key, "gpt-4.1", "ChatGPT 4.1", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_GPT)
            , new ModelOfMyLLMroot(MyChatGPT_key.myChatGPT_key, "gpt-4o", "gpt-4o", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_GPT)
            , new ModelOfMyLLMroot(MyChatGPT_key.myChatGPT_key, "gpt-3.5-turbo", "gpt-3.5-turbo", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_GPT)
            , new ModelOfMyLLMroot(MyChatGPT_key.myChatGPT_key, "gpt-4o-mini", "gpt-4o-mini", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_GPT)
        ])
    }
} // class MyChatGPT_key

//------------------------------------------------------------
class MyGemini_key extends MyCloudLLMroot {
    static myGemini_key

    constructor() {
        super("ID_GEMINI_KEY", "Gemini", "AI/google-gemini-icon.svg", "https://gemini.google.com/app")
        MyGemini_key.myGemini_key = this
        this.underConstruction = false
        this.modelForVercelAI = 'models/gemini-2.5-pro'
        this.costPerMillionTokenIn = 1.25
        this.costPerMillionTokenOut = 10

        this.addModelsFromArray([
            new ModelOfMyLLMroot(MyGemini_key.myGemini_key, "gemini-2.5-pro-exp-03-25", "Gemini 2.5 experimental", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_GEMINI)
            , new ModelOfMyLLMroot(MyGemini_key.myGemini_key, "gemini-2.5-pro-preview-03-25", "Gemini 2.5 preview", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_GEMINI)
        ])

    }
} // class MyGemini_key


//------------------------------------------------------------
class MyPerplexity_key extends MyCloudLLMroot {
    static myPerplexity_key

    constructor() {
        super("ID_PERPLEXITY_KEY", "Perplexity", "AI/icons8-perplexity-ai.svg", "https://www.perplexity.ai/")
        MyPerplexity_key.myPerplexity_key = this
        this.underConstruction = false
        this.costPerMillionTokenIn = 1
        this.costPerMillionTokenOut = 5

        this.modelForVercelAI = 'llama-3.1-sonar-large-128k-online'
        this.addModelsFromArray([
            new ModelOfMyLLMroot(MyPerplexity_key.myPerplexity_key, "sonar-pro", "sonar-pro", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_SONAR)
        ])
    }
} // class MyPerplexity_key

class MyAnthropic_key extends MyCloudLLMroot //Cluse AI
{
    static myAnthropic_key

    constructor() {
        super("ID_ANTHROPIC_KEY", "Anthropic AI", "AI/claude-ai-icon.svg", "https://www.anthropic.com/");
        MyAnthropic_key.myAnthropic_key = this
        this.underConstruction = false
        this.costPerMillionTokenIn = 3
        this.costPerMillionTokenOut = 15

        this.addModelsFromArray([
            new ModelOfMyLLMroot(MyAnthropic_key.myAnthropic_key, "claude-3-7-sonnet-20250219", "Claude 3.7 Sonnet", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_CLAUDE)
            , new ModelOfMyLLMroot(MyAnthropic_key.myAnthropic_key, "claude-3-opus-20240229", "Claude 3 Opus", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_CLAUDE)
            , new ModelOfMyLLMroot(MyAnthropic_key.myAnthropic_key, "claude-3-5-sonnet-20240620", "Claude 3.5 Sonnet", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_CLAUDE)
            , new ModelOfMyLLMroot(MyAnthropic_key.myAnthropic_key, "claude-3-haiku-20240307", "Claude 3 Haiku", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_CLAUDE)
        ])

    }
} // class MyAnthropic_key


class MyGroq_key extends MyCloudLLMroot //Cluse AI
{
    static myGroq_key

    constructor() {
        super("ID_GROQ_KEY", "Groq AI", "AI/groq-icon-logo-png_seeklogo-605779.png", "https://groq.com/");
        MyGroq_key.myGroq_key = this
        this.underConstruction = false
        this.costPerMillionTokenIn = 0.15
        this.costPerMillionTokenOut = 0.75

        this.modelForVercelAI = "llama-3.3-70b-versatile"
        this.addModelsFromArray([
            new ModelOfMyLLMroot(MyGroq_key.myGroq_key, "llama-3.3-70b-versatile", "Claude 3.7 Sonnet", ModelOfMyLLMroot.MODEL_TYPE_CHAT, ModelOfMyLLMroot.MODEL_META)
        ])

    }
} // class MyGroq_key


//------------------------------------------------------------
//may be useful for network shared AI processing
class MySharedLLMroot extends MyLLMroot {
    static mapOnlyTHisID_to_lastS_listCloudAPIkeysHTML = new Map()
    static baseApps = new Set();

    constructor(uniqueID, name_param, imageURL = "ChatPlaces/SharedAI.svg", chatPlaces_obj) {
        super(uniqueID, name_param, imageURL)
        this.chatPlaces_obj = chatPlaces_obj
        chatPlaces_obj.myLLM = this
        this.underConstruction = false
        this.availability = MyLLMroot.STATE_AVAILABILITY_AVAILABLE
        MyLLMroot.mapMySharedLLMs.set(this.name, this)
    }
} // class MySharedLLMroot


//------------------------------------------------------------
class ModelNameLLM
{
    static mapNameToModels = new Map()


    constructor(name, company, image)
    {
    this.name = name
    this.company = company
    this.image = image

     ModelNameLLM.mapNameToModels.set(name, this)
    }
//------------------------------------------------------------
    icon(height = "20px")
    {
     return "<img src='"+ cdniverse +"AI/models/" + this.image + "' style='height:"+height+"' title='" + this.name + "'>"
    }

}//  class ModelName
//------------------------------------------------------------
class ModelType
{
    constructor(type_name, designation, acceptsEmptyQuestion = false
                , numActionsPossibleWithNoObject = 1
                , numActionsPossibleWithOneObject = 1
                , numActionsPossibleWithManyObjects = 1)
    {
        this.name = type_name
        this.designation = designation
        this.acceptsEmptyQuestion = acceptsEmptyQuestion
        this.numActionsPossibleWithNoObject = numActionsPossibleWithNoObject
        this.numActionsPossibleWithOneObject = numActionsPossibleWithOneObject
        this.numActionsPossibleWithManyObjects = numActionsPossibleWithManyObjects

        ModelOfMyLLMroot.modelTypes.set(type_name, this)
    }
//------------------------------------------------------------
numActionsPossibleForTheseNumberOfObjects(numObjects)
{
    return numObjects === 1
       ? this.numActionsPossibleWithOneObject
       : numObjects > 1
          ? this.numActionsPossibleWithManyObjects
          : this.numActionsPossibleWithNoObject //image recognition have 0, summarization has 1 for the text can be in the prompt
}
//------------------------------------------------------------

}// class ModelType


class ModelOfMyLLMroot
{

    static MODEL_TYPE_OPTIONS = ["no use", "meeting", "all uses"]
    static MODEL_TYPE_ALL = "ALL"
    static MODEL_TYPE_CHAT = "chat"
    static MODEL_TYPE_SUMMARY = "summary"
    static MODEL_TYPE_IMAGE_RECOGNITION = "image recognition"
    static MODEL_TYPE_IMAGE_GENERATION = "image generation"
    static modelTypes = new Map()

    static map_uuid_to_modelType = new Map()

     static MODEL_APPLE_FM = "Apple Foundation" //Models
     static MODEL_CLAUDE = "Claude"
     static MODEL_DEEPSEEK = "DeepSeek"
     static MODEL_GEMINI = "Gemini"
     static MODEL_GEMMA = "Gemma"
     static MODEL_GPT = "ChatGPT"
     static MODEL_LIQUID = "Liquid"
     static MODEL_META = "META (Llama, ...)"
     static MODEL_SONAR = "Sonar"
     static MODEL_QWEN = "Qwen"

    static selectedModelType = ModelOfMyLLMroot.MODEL_TYPE_ALL

    static modelsOfMyLLM = new Map()

    constructor( myLLM, id, name, type = MODEL_TYPE_CHAT, family = "model", jsonParams = {})
    {
        ModelOfMyLLMroot.modelsOfMyLLM.set(id, this)
        this.myLLM = myLLM
        this.id = id
        this.name = name
        this.type = type
        this.family = family
        this.jsonParams = jsonParams
    }
//-----------------------------------------------------------
icon(height = "20px")
{
    return this.modelFamily().icon(height)
}
//-----------------------------------------------------------
    toString()
    {
        return this.name
    }
//-----------------------------------------------------------
static numModels(localORcloud, type)
    {
        let num = 0;
        for(let [name, modelOfLLM] of ModelOfMyLLMroot.modelsOfMyLLM)
            if (!localORcloud || localORcloud == modelOfLLM.myLLM.localORcloudString())
                if(!type || type == modelOfLLM.type)
                    num++
        return num
    }

//------------------------------------------------------------
    modelFamily()
    {
      return ModelNameLLM.mapNameToModels.get(this.family)
    }
} // class ModelOfMyLLMroot


MyLLMroot.initialize()

const LocalAIbaseline = {
    hello,
    update_localAIbaseline_mainTable,
    MyLLMroot,
}

export default LocalAIbaseline