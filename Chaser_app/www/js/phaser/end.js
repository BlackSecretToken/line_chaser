/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: "EndScreen"});
    }

    preload() {
        this.textures.remove('Avatar');
        this.load.image("Avatar", "./images/avatar/" + userData.avatar + ".png");
        this.load.image("Panel", "./images/user_panel.png");
        this.load.image("Board", "./images/game_board.png");
        this.load.image("Heart", "./images/heart.png");
        this.load.image("Coin", "./images/coin.png");
        this.load.image("Point", "./images/point.png");
        this.load.image("MainPage", "./images/main_page.png");

        if(level <= 50){
            this.load.image("PlayAgain", "./images/play_again.png");
            this.load.image("PurchaseCoin", "./images/purchase_coin.png");
            this.load.image("ReviveAdmob", "./images/revive_admob.png");
            this.load.image("ReviveCoin", "./images/revive_coin.png");
        }
    }

    create() {
        this.panel = this.add.image(540,200,'Panel');
        this.avatar = this.add.image(165,200,'Avatar').setScale(0.5);

        this.userNameText = this.add.text(450, 150, userData.username, { fixedWidth: 300, fixedHeight: 70 })
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);

        this.hearts = [];
        for(let i=0; i<3; i++)
        {
            let heart = this.add.image(350 + i*105 , 250, 'Heart');
            if(i+1 > userData.heart)
                heart.setVisible(false);
            this.hearts.push(heart);
        }

        this.coin = this.add.image(700,140,'Coin').setScale(0.15);
        this.coinText = this.add.text(900, 140, userData.coin, { fixedWidth: 300, fixedHeight: 70 })
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffff00',
        })
        .setOrigin(0.5,0.5);

        this.point = this.add.image(700,260,'Point').setScale(0.15);
        this.pointText = this.add.text(900, 260, userData.point, { fixedWidth: 300, fixedHeight: 70 })
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffff00',
        })
        .setOrigin(0.5,0.5);

        this.board = this.add.image(540,1195,'Board');

        if(level>50)
        {
            this.resultText = this.add.text(540, 1000, 'Congratulations!\nYou have completed 50 levels.', { fixedWidth: 1000, fixedHeight: 200 })
            .setStyle({
                fontSize: '76px',
                fontFamily: 'RR',
                fontWeight: 'bold',
                align: "center",
                fill: '#fa5c00',
            })
            .setOrigin(0.5,0.5);
            this.resultText.stroke = "#f0fafe";
            this.resultText.strokeThickness = 32;
            //  Apply the shadow to the Stroke and the Fill (this is the default)
            this.resultText.setShadow(10, 10, "#333333", 10, true, true);

            this.mainButton = this.add.image(540,1500,'MainPage');
            this.mainButton.setInteractive().on('pointerdown', () => {
                game.scene.stop('EndScreen');
                game.scene.start('HomeScreen');
            });
        }
        else
        {
            this.resultText = this.add.text(540, 700, 'You have failed.', { fixedWidth: 1000, fixedHeight: 200 })
            .setStyle({
                fontSize: '76px',
                fontFamily: 'RR',
                fontWeight: 'bold',
                align: "center",
                fill: '#963700',
            })
            .setOrigin(0.5,0.5);
            this.resultText.stroke = "#f0fafe";
            this.resultText.strokeThickness = 32;
            //  Apply the shadow to the Stroke and the Fill (this is the default)
            this.resultText.setShadow(10, 10, "#333333", 10, true, true);

            this.admobButton = this.add.image(540,1000,'ReviveAdmob');
            this.admobButton.setInteractive().on('pointerdown', () => {
                userData.heart = (Number.parseInt(userData.heart) + 1) > 3 ? 3 : (Number.parseInt(userData.heart) + 1);
                Client.level_end(1, 0, 0);
                for(let i=0; i<3; i++)
                {
                    if(i+1 > userData.heart)
                        this.hearts[i].setVisible(false);
                    else
                        this.hearts[i].setVisible(true);
                }
                AdMob.showInterstitial();
                AdMob.prepareInterstitial({
                    adId: admobid.interstitial,
                    autoShow:false,
                    isTesting: true,
                });
                this.againButton.setAlpha(1.0);
                this.againButton.setInteractive();
            });
            this.coinButton = this.add.image(540,1200,'ReviveCoin');
            this.coinButton.setInteractive().on('pointerdown', () => {
                userData.coin = Number.parseInt(userData.coin) - 1000;
                Client.level_end(0, -1000, 0);
                for(let i=0; i<3; i++)
                {
                    if(i+1 > userData.heart)
                        this.hearts[i].setVisible(false);
                    else
                        this.hearts[i].setVisible(true);
                }
                this.coinText.setText(userData.coin);
                this.againButton.setAlpha(1.0);
                this.againButton.setInteractive();
                if(Number.parseInt(userData.coin)<1000){
                    this.coinButton.disableInteractive();
                    this.coinButton.setAlpha(0.5);
                }
            });
            if(Number.parseInt(userData.coin)<1000){
                this.coinButton.disableInteractive();
                this.coinButton.setAlpha(0.5);
            }
            this.purchaseButton = this.add.image(540,1400,'PurchaseCoin');
            this.purchaseButton.setInteractive().on('pointerdown', () => {
                game.scene.stop('EndScreen');
                game.scene.start('StripeScreen');
            });
            this.againButton = this.add.image(540,1600,'PlayAgain');
            this.againButton.disableInteractive().on('pointerdown', () => {
                game.scene.stop('EndScreen');
                game.scene.start('GameScreen');
            });
            this.againButton.setAlpha(0.5);
            this.mainButton = this.add.image(540,1800,'MainPage');
            this.mainButton.setInteractive().on('pointerdown', () => {
                game.scene.stop('EndScreen');
                game.scene.start('HomeScreen');
            });
        }

    }

    update(){
    }

    updateUser(){
        this.texture.remove('Avatar');
        for(let i=0; i<3; i++)
        {
            if(i+1 > userData.heart)
                this.hearts[i].setVisible(false);
            else
                this.hearts[i].setVisible(true);
        }
        this.coinText.setText(userData.coin);
        this.pointText.setText(userData.point);

        if(userData.heart >0)
        {
            this.againButton.setAlpha(1.0);
            this.againButton.setInteractive();
        }

        if(Number.parseInt(userData.coin)>=1000){
            this.coinButton.setInteractive();
            this.coinButton.setAlpha(1.0);
        }
    }
}
