/*
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 * <span class="fa fa-lg fa-paper-plane"></span>
 * <span class="fa fa-lg fa-user-circle"></span>
 * <span class="fa fa-lg fa-info-circle"></span>
 */

function loadWidget(waifuPath, apiPath) {
    localStorage.removeItem("waifu-display");
    sessionStorage.removeItem("waifu-text");
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="300" height="300"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);
    // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
    setTimeout(() => {
        document.getElementById("waifu").style.bottom = 0;
    }, 0);

    function registerEventListener() {
        document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
        document.querySelector("#waifu-tool .fa-paper-plane").addEventListener("click", () => {
            if (window.Asteroids) {
                if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
                window.ASTEROIDSPLAYERS.push(new Asteroids());
            } else {
                var script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/gh/GalaxyMimi/CDN/asteroids.js";
                document.head.appendChild(script);
            }
        });
        document.querySelector("#waifu-tool .fa-user-circle").addEventListener("click", loadOtherModel);
        document.querySelector("#waifu-tool .fa-street-view").addEventListener("click", loadRandModel);
        document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () => {
            showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
            Live2D.captureName = "photo.png";
            Live2D.captureFrame = true;
        });
        document.querySelector("#waifu-tool .fa-info-circle").addEventListener("click", () => {
            open("https://github.com/stevenjoezhang/live2d-widget");
        });
        document.querySelector("#waifu-tool .fa-times").addEventListener("click", () => {
            localStorage.setItem("waifu-display", Date.now());
            showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
            document.getElementById("waifu").style.bottom = "-500px";
            setTimeout(() => {
                document.getElementById("waifu").style.display = "none";
                document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
            }, 3000);
        });
        var devtools = () => {};
        console.log("%c", devtools);
        devtools.toString = () => {
            showMessage("哈哈，你打开了控制台，是想要看看我的小秘密吗？", 6000, 9);
        };
        window.addEventListener("copy", () => {
            showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
        });
        window.addEventListener("visibilitychange", () => {
            if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
        });
    }
    registerEventListener();

    function welcomeMessage() {
        var text;
        if (location.pathname === "/") { // 如果是主页
            var now = new Date().getHours();
            if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始啦！";
            else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
            else if (now > 11 && now <= 13) text = "中午了，工作了一个上午，现在是午餐时间呦~";
            else if (now > 13 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
            else if (now > 17 && now <= 19) text = "傍晚了，窗外夕阳的景色很美丽呢，最美不过夕阳红～";
            else if (now > 19 && now <= 21) text = ["晚上好，今天过得怎么样？", "今天有什么收获吗~"];
            else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
            else text = "你是夜猫子嘛？这么晚还不睡觉，明天起的来嘛？";
        } else if (document.referrer !== "") {
            var referrer = new URL(document.referrer),
                domain = referrer.hostname.split(".")[1];
            if (location.hostname == referrer.hostname) text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
            else if (domain == "baidu") text = `Hello！来自 百度搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&wd=")[1].split("&")[0]}</span> 找到的我吗？`;
            else if (domain == "so") text = `Hello！来自 360搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&q=")[1].split("&")[0]}</span> 找到的我吗？`;
            else if (domain == "google") text = `Hello！来自 谷歌搜索 的朋友<br>欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
            else text = `Hello！来自 <span>${referrer.hostname}</span> 的朋友`;
        } else {
            text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
        }
        showMessage(text, 7000, 8);
    }
    welcomeMessage();
    // 检测用户活动状态，并在空闲时显示消息
    var userAction = false,
        userActionTimer = null,
        messageTimer = null,
        messageArray = ["记得把小家加入 Adblock 白名单哦！", "旅居人间十九载", "若能避开猛烈的欢喜,自然也不会有悲痛的来袭  ——太宰治", "Never put off till tomorrow what you can do today", "君子终日乾乾,夕惕若厉,无咎  ——《周易·乾》", "晚来天欲雪❄️能饮一杯无  ——白居易", "心之所向💘素履以往&#44;生如逆旅🍃一苇以航  ——七堇年", "死亡不是失去生命⏳而是走出时间  ——余华", "我年轻过,落魄过,幸福过,我对生活一往情深  ——马尔克斯", "爱的反面不是仇恨💔是漠不关心  ——特蕾莎修女", "即使没有月亮🌙心中也是一片皎洁  ——路遥", "惟沉默是最高的轻蔑  ——鲁迅", "人生一世🌿草生一春,来如风雨,去似微尘  ——《增广贤文》", "行至朝雾里🌫坠入暮云间", "月光下🌕你带着笑向我走来🌨月色与雪色之间🌙你是第三种绝色  ——余光中", "陌上花开❀可缓缓归矣  ——钱缪", "牛羊才成群结队,猛兽永远独行  ——鲁迅", "宁山间碎骨,沉河不浮,不愿守棺而驻,灵魂碌碌", "祝你所求皆如愿,所行化坦途,多喜乐,长安宁", "且将新火试新茶🍵诗酒趁年华  ——苏轼《望江南》", "醉后不知天在水🌌满船清梦压星河  ——唐珙《题龙阳县青草湖》", "最是人间留不住,朱颜辞镜花辞树  ——王国维《蝶恋花》", "玲珑骰子安红豆❣️入骨相思知不知  ——温庭筠《杨柳枝》", "小舟从此逝,江海寄余生  ——苏轼《临江仙》", "山中何事?松花酿酒🍶春水煎茶  ——张可久《人月圆》", "我有一瓢酒🍵可以慰风尘  ——韦应物《简卢陟》", "人生有两出悲剧。一是万念俱灰;另一是踌躇满志  ——萧伯纳", "纵然伤心,也不要愁眉不展,因为你不知是谁会爱上你的笑容  ——泰戈尔", "优于别人,并不高贵,真正的高贵应该是优于过去的自己  ——海明威", "你能在浪费时间中获得乐趣⏳就不是浪费时间  ——罗素", "这个世界如此美好，值得人们为它奋斗。我只同意后半句  ——海明威", "一切伟大的行动和思想，都有一个微不足道的开始  ——加缪", "命是弱者的借口，运是强者的谦辞  ——赫尔曼·黑塞", "苦难有多深,人类的荣耀就有多高远  ——索尔仁尼琴", "我笑😘是因为生活不值得用泪水面对  ——显克微支", "当华美的叶片落尽🍂生命的脉络才历历可见  ——聂鲁达", "爱情太短&#44;而遗忘太长  ——聂鲁达", "年轻时,我们彼此相爱却浑然不知  ——叶芝", "风雅,就是发现存在的美,感觉已经发现的美  ——川端康成", "世上的事大都经不起推敲,一推敲,哪一件都藏着委屈  ——刘震云"];
    window.addEventListener("mousemove", () => userAction = true);
    window.addEventListener("keydown", () => userAction = true);
    setInterval(() => {
        if (userAction) {
            userAction = false;
            clearInterval(userActionTimer);
            userActionTimer = null;
        } else if (!userActionTimer) {
            userActionTimer = setInterval(() => {
                showMessage(messageArray[Math.floor(Math.random() * messageArray.length)], 6000, 9);
            }, 20000);
        }
    }, 1000);

    function showHitokoto() {
        // 增加 hitokoto.cn 的 API
        fetch("https://v1.hitokoto.cn")
            .then(response => response.json())
            .then(result => {
                var text = `这句一言来自 <span style="color:#0099cc;">『${result.from}』</span>，是 <span style="color:#0099cc;">${result.creator}</span> 在 hitokoto.cn 投稿的。`;
                showMessage(result.hitokoto, 6000, 9);
                setTimeout(() => {
                    showMessage(text, 4000, 9);
                }, 6000);
            });
    }

    function showMessage(text, timeout, priority) {
        if (!text) return;
        if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= priority) {
            if (messageTimer) {
                clearTimeout(messageTimer);
                messageTimer = null;
            }
            if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length)];
            sessionStorage.setItem("waifu-text", priority);
            var tips = document.getElementById("waifu-tips");
            tips.innerHTML = text;
            tips.classList.add("waifu-tips-active");
            messageTimer = setTimeout(() => {
                sessionStorage.removeItem("waifu-text");
                tips.classList.remove("waifu-tips-active");
            }, timeout);
        }
    }

    function initModel() {
        var modelId = localStorage.getItem("modelId"),
            modelTexturesId = localStorage.getItem("modelTexturesId");
        if (modelId == null) {
            // 首次访问加载 指定模型 的 指定材质
            var modelId = 1, // 模型 ID
                modelTexturesId = 53; // 材质 ID
        }
        loadModel(modelId, modelTexturesId);
        fetch(waifuPath)
            .then(response => response.json())
            .then(result => {
                result.mouseover.forEach(tips => {
                    window.addEventListener("mouseover", event => {
                        if (!event.target.matches(tips.selector)) return;
                        var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
                        text = text.replace("{text}", event.target.innerText);
                        showMessage(text, 4000, 8);
                    });
                });
                result.click.forEach(tips => {
                    window.addEventListener("click", event => {
                        if (!event.target.matches(tips.selector)) return;
                        var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
                        text = text.replace("{text}", event.target.innerText);
                        showMessage(text, 4000, 8);
                    });
                });
                result.seasons.forEach(tips => {
                    var now = new Date(),
                        after = tips.date.split("-")[0],
                        before = tips.date.split("-")[1] || after;
                    if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
                        var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
                        text = text.replace("{year}", now.getFullYear());
                        //showMessage(text, 7000, true);
                        messageArray.push(text);
                    }
                });
            });
    }
    initModel();

    function loadModel(modelId, modelTexturesId) {
        localStorage.setItem("modelId", modelId);
        if (modelTexturesId === undefined) modelTexturesId = 0;
        localStorage.setItem("modelTexturesId", modelTexturesId);
        loadlive2d("live2d", `${apiPath}/get/?id=${modelId}-${modelTexturesId}`, console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`));
    }

    function loadRandModel() {
        var modelId = localStorage.getItem("modelId"),
            modelTexturesId = localStorage.getItem("modelTexturesId");
        // 可选 "rand"(随机), "switch"(顺序)
        fetch(`${apiPath}/rand_textures/?id=${modelId}-${modelTexturesId}`)
            .then(response => response.json())
            .then(result => {
                if (result.textures.id == 1 && (modelTexturesId == 1 || modelTexturesId == 0)) showMessage("我还没有其他衣服呢！", 4000, 10);
                else showMessage("我的新衣服好看嘛？", 4000, 10);
                loadModel(modelId, result.textures.id);
            });
    }

    function loadOtherModel() {
        var modelId = localStorage.getItem("modelId");
        fetch(`${apiPath}/switch/?id=${modelId}`)
            .then(response => response.json())
            .then(result => {
                loadModel(result.model.id);
                showMessage(result.model.message, 4000, 10);
            });
    }
}

function initWidget(waifuPath = "/waifu-tips.json", apiPath = "") {
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
			<span>看板娘</span>
		</div>`);
    var toggle = document.getElementById("waifu-toggle");
    toggle.addEventListener("click", () => {
        toggle.classList.remove("waifu-toggle-active");
        if (toggle.getAttribute("first-time")) {
            loadWidget(waifuPath, apiPath);
            toggle.removeAttribute("first-time");
        } else {
            localStorage.removeItem("waifu-display");
            document.getElementById("waifu").style.display = "";
            setTimeout(() => {
                document.getElementById("waifu").style.bottom = 0;
            }, 0);
        }
    });
    if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
        toggle.setAttribute("first-time", true);
        setTimeout(() => {
            toggle.classList.add("waifu-toggle-active");
        }, 0);
    } else {
        loadWidget(waifuPath, apiPath);
    }
}