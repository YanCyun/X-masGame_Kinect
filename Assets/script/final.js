#pragma strict

public var medal:GameObject;
public var medal_sprite:Sprite[];
public var button:GameObject;
public var man:GameObject;
public var draw_medal:GameObject;
public var glow:GameObject;

public var time:float;

public var story:String[] = ["在這段有你幫忙的時間裡",
							 "聖誕老人也很順利的康復了",
						  	 "為了感謝你的幫忙",
						  	 "聖誕老人特別頒發勳章給你",
						  	 "希望以後你也可以像幫助",
						  	 "聖誕老人一樣",
						  	 "幫助其他需要幫助的人"];

//GUI
private var baseW:float = 1600;
private var baseH:float = 900;
private var scale:Vector3;

public var position_GUI:Rect = new Rect(200,15,200,20);
public var style_GUI:GUIStyle;

function Start () {

}

function Update () {
	
	
	time += Time.deltaTime;
	if(time < 6) man.renderer.enabled = true;
	else if(time < 9){
		man.renderer.enabled = false;
		draw_medal.renderer.enabled = true;
	} 
	else if(time <21){
		draw_medal.renderer.enabled = false;
		medal.renderer.enabled = true;	
		glow.renderer.enabled = true;	
		glow.transform.eulerAngles += Vector3(0, 0, 1);
	}
	else{
		button.SetActive(true);
		glow.transform.eulerAngles += Vector3(0, 0, 1);
	}
	var m_sprite:SpriteRenderer = medal.GetComponent(SpriteRenderer);
	
	if(menu.time < 90) m_sprite.sprite = medal_sprite[0];
	else if(menu.time < 180) m_sprite.sprite = medal_sprite[1];
	else m_sprite.sprite = medal_sprite[2];
	if(Input.GetMouseButtonDown(0)){	
		if(button.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
			menu.SCORE = 0;
			menu.start = false;
			menu.time = 0;
			init.victory = false;
			
			Destroy(GameObject.Find("BackgroundMusic"));
			Application.LoadLevel("menu");
		}
	}
	if(handtrigger.click_event == "button"){
		menu.SCORE = 0;
		menu.start = false;
		menu.time = 0;
		init.victory = false;
			
		Destroy(GameObject.Find("BackgroundMusic"));
		Application.LoadLevel("menu");
		handtrigger.click_event = "";
	}
}

function OnGUI(){

	scale = Vector3(parseFloat(Screen.width)/baseW,parseFloat(Screen.height)/baseH,1);
	var svMat = GUI.matrix;
	GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);
	
	//GUI.Label(position_GUI,story[5],style_GUI);
	
	if(time < 3)GUI.Label(position_GUI,story[0],style_GUI);
	else if(time < 6)GUI.Label(position_GUI,story[1],style_GUI);
	else if(time < 9)GUI.Label(position_GUI,story[2],style_GUI);
	else if(time < 12)GUI.Label(position_GUI,story[3],style_GUI);
	else if(time < 15)GUI.Label(position_GUI,story[4],style_GUI);
	else if(time < 18)GUI.Label(position_GUI,story[5],style_GUI);
	else if(time < 21)GUI.Label(position_GUI,story[6],style_GUI);
	
	
	
	
	GUI.matrix = svMat;

}

