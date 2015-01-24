#pragma strict

public static var victory:boolean = false;


public var house_unlight:GameObject[];
public var house_light:GameObject[];
public var unlightClip:AudioClip;
public var socks:GameObject[];
public var victoryClip:AudioClip;
public var complete:GameObject;
public var complete_clip:AudioClip;
public var finalScene:GameObject;
public var restart:GameObject;


private var audioButton:boolean = false;
private var unlight_time:float = 0f;
private var unlight : boolean = false;
private var num_unlight:int = 0;

//GUI
private var baseW:float = 1600;
private var baseH:float = 900;
private var scale:Vector3;

public var position_GUI:Rect = new Rect(200,15,200,20);
public var position_win:Rect = new Rect(200,15,200,20);
public var style_GUI:GUIStyle;


function Start () {

	if(menu.start) Destroy(GameObject.Find("cutdown"));
}

function Update () {
	
	if(menu.SCORE == 5 && !victory) {
		victory = true;
		AudioSource.PlayClipAtPoint(complete_clip,transform.position);
		GameObject.Find("sceneComplete").renderer.enabled = true;
		complete.renderer.enabled = true;
	}
	if(!victory){
		restart.SetActive(true);
		unlight_time += Time.deltaTime;
		//unlight voice
		if(unlight_time >= 4.5f){
			if(!audioButton){
				AudioSource.PlayClipAtPoint(unlightClip,transform.position);
				audioButton = true;
			}
		}
		
		//unlight
		if(unlight_time >= 5f && !unlight){
			num_unlight = Random.Range(0,9);
			house_unlight[num_unlight].SetActive(true);
			house_light[num_unlight].SetActive(false);
			unlight = true;			
		}
		
		if(handtrigger.click_event.length >= 7){
			if(handtrigger.click_event.Substring(0,7) == "unlight"){
				Application.LoadLevel("gameScene");
				handtrigger.click_event = "";
			}
		}
		if(handtrigger.click_event == "restart_button"){
			menu.SCORE = 0;
			menu.start = false;
			menu.time = 0;
			victory = false;
				
			Destroy(GameObject.Find("BackgroundMusic"));
			Application.LoadLevel("menu");
			handtrigger.click_event = "";
		}
		
		//Click unlight house
		if(Input.GetMouseButtonDown(0) && unlight){		
			if(house_unlight[num_unlight].collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				Application.LoadLevel("gameScene");
			}
		}
		if(Input.GetMouseButtonDown(0)){		
			if(restart.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				menu.SCORE = 0;
				menu.start = false;
				menu.time = 0;
				victory = false;
				
				Destroy(GameObject.Find("BackgroundMusic"));
				Application.LoadLevel("menu");
			}
		}
		
	}
	else{
		finalScene.SetActive(true);
		restart.SetActive(false);
		VictoryAnimation();
		if(handtrigger.click_event == "Final_scene"){
			Application.LoadLevel("final");
			handtrigger.click_event = "";
		}
		if(Input.GetMouseButtonDown(0)){		
			if(finalScene.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				Application.LoadLevel("final");
			}
		}
	}
	
	//display score	
	for(var i = 0 ; i < menu.SCORE ; i++){
		socks[i].renderer.enabled = true;
	}

}

function VictoryAnimation(){
	if(complete.transform.localScale.x >= 1)
		complete.transform.localScale *= 0.9;
}

function OnGUI(){
	

	scale = Vector3(parseFloat(Screen.width)/baseW,parseFloat(Screen.height)/baseH,1);
	var svMat = GUI.matrix;
	GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);
	
	
	if(victory) GUI.Label(position_win,menu.GAME_TIME,style_GUI);
	else if(menu.start) GUI.Label(position_GUI,menu.GAME_TIME,style_GUI);
	
	
	GUI.matrix = svMat;

}