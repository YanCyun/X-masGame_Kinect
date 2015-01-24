#pragma strict


public static var GAME_TIME : String = "";
public static var SCORE : int = 0 ;
public static var start:boolean = false;
public static var answer_type = 0;

public static var time:float = 0f;

public var countDown:Sprite[];

function Start () {
	//DontDestroyOnLoad(transform.gameObject);
	//Application.LoadLevel("level");
}

function Update () {
	//Debug.Log(Application.loadedLevel);
	
	if(init.victory){
		gameObject.audio.Stop();
	}
	else if(Application.loadedLevel != 0){
		
		time += Time.deltaTime;
		
		if(start){
			
			var minute:int = Mathf.Floor(time/60f);
			var second:int = Mathf.Floor(time - minute*60);
			
			var time_string:String = "";
			
			if(minute >= 10) time_string += minute + " : ";
			else time_string += "0"+minute + " : ";
				
			if(second >= 10) time_string += "" + second;
			else time_string += "0" + second;
			
			GAME_TIME = time_string;
		}
		else{
			GameObject.Find("cutdown").GetComponent(SpriteRenderer).sprite = countDown[Mathf.Floor(time)];
			if(time > 3.5){
				Destroy(GameObject.Find("cutdown"));
				start = true;
				time = 0;
			}
		}
	}
}