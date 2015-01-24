#pragma strict



public var startButton:GameObject;
public var missionButton:GameObject;
public var menu2:GameObject;
public var menu3:GameObject;
public var select:GameObject;
public var skip:GameObject;
public var colorButton:GameObject;
public var numberButton:GameObject;

public var start:boolean = false;
public var time:float = 0;

//GUI
private var baseW:float = 1600;
private var baseH:float = 900;
private var scale:Vector3;

private var story:String[] = ["每當聖誕節一到",
							  "城鎮裡的小朋友們",
							  "都期待著聖誕老公公的到來",
							  "但是今年",
							  "聖誕老公公不小心感冒了",
							  "身體不太舒服",
						  	  "他需要有人幫助他完成送禮物的任務",
						  	  "小朋友，你有辦法幫助聖誕老公公",
						  	  "完成這個任務嗎？"];

public var position_GUI:Rect = new Rect(200,15,200,20);
public var position2_GUI:Rect = new Rect(200,15,200,20);
public var story_GUI:Rect = new Rect(200,15,200,20);
public var skip_GUI:Rect = new Rect(200,15,200,20);
public var style_GUI:GUIStyle;
public var style_GUI2:GUIStyle;
public var story_style:GUIStyle;
public var skip_style:GUIStyle;

function Start () {

}

function Update () {
	
	if(handtrigger.click_event == "StartButton"){
		menu2.renderer.enabled = true;
		select.renderer.enabled = true;
		colorButton.SetActive(true);
		numberButton.SetActive(true);
		startButton.SetActive(false);
		handtrigger.click_event = "";
	}
	if(handtrigger.click_event == "ColorButton"){
		menu.answer_type = 1;
		start = true;
		select.renderer.enabled = false;
		colorButton.SetActive(false);
		numberButton.SetActive(false);
		skip.SetActive(true);
		audio.Play();
		handtrigger.click_event = "";
	}
	if(handtrigger.click_event == "NumberButton"){
		start = true;
		menu.answer_type = 0;
		select.renderer.enabled = false;
		colorButton.SetActive(false);
		numberButton.SetActive(false);
		skip.SetActive(true);
		audio.Play();
		handtrigger.click_event = "";
	}
	if(handtrigger.click_event == "skip"){
		time = 28.1;
		audio.Stop();
		handtrigger.click_event = "";
	}
	if(handtrigger.click_event == "MissiontButton"){
		audio.Stop();
		DontDestroyOnLoad(GameObject.Find("BackgroundMusic"));
		Application.LoadLevel("level");
		handtrigger.click_event = "";
	}
	

	if(Input.GetMouseButtonDown(0)){		
			if(startButton.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				menu2.renderer.enabled = true;
				select.renderer.enabled = true;
				colorButton.SetActive(true);
				numberButton.SetActive(true);
				startButton.SetActive(false);
			}
			if(colorButton.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				menu.answer_type = 1;
				start = true;
				select.renderer.enabled = false;
				colorButton.SetActive(false);
				numberButton.SetActive(false);
				skip.SetActive(true);
				audio.Play();
			}
			if(numberButton.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				start = true;
				menu.answer_type = 0;
				select.renderer.enabled = false;
				colorButton.SetActive(false);
				numberButton.SetActive(false);
				skip.SetActive(true);
				audio.Play();
			}
			if(skip.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				time = 28.1;
				audio.Stop();
			}
			if(missionButton.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				audio.Stop();
				DontDestroyOnLoad(GameObject.Find("BackgroundMusic"));
				Application.LoadLevel("level");
			}
	}
	if(start){
		time += Time.deltaTime;
		if(time > 28){
			menu3.renderer.enabled = true;
			missionButton.SetActive(true);
			skip.SetActive(false);
		}
	}
}

function OnGUI(){

	scale = Vector3(parseFloat(Screen.width)/baseW,parseFloat(Screen.height)/baseH,1);
	var svMat = GUI.matrix;
	GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);
	
	if(select.renderer.enabled == true) GUI.Label(position_GUI,"",style_GUI);
	else if(!start) GUI.Label(position_GUI,"",style_GUI);
	else{
		if(time < 28) GUI.Label(skip_GUI,"跳過",skip_style);
		if(time < 2)
			GUI.Label(story_GUI,story[0],story_style);
		else if(time < 4.5)
			GUI.Label(story_GUI,story[1],story_style);
		else if(time < 8)
			GUI.Label(story_GUI,story[2],story_style);
		else if(time < 10.5)
			GUI.Label(story_GUI,story[3],story_style);
		else if(time < 14)
			GUI.Label(story_GUI,story[4],story_style);
		else if(time < 17)
			GUI.Label(story_GUI,story[5],story_style);
		else if(time < 22)
			GUI.Label(story_GUI,story[6],story_style);
		else if(time < 28)
			GUI.Label(story_GUI,story[7],story_style);
		else{
			GUI.Label(story_GUI,story[8],story_style);
		 	GUI.Label(position2_GUI,"",style_GUI2);
		}
	}
	GUI.matrix = svMat;

}