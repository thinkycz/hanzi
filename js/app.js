new Vue({
    el: '#app',

    data: {
        json: '',
        page: 'course',
        selectedCharacter: '',
        selectedCategory: '',
        answer: {
            translation: '[ english ]',
            pinyin: 'pinyin'
        },
        score: 0
    },

    computed: {
        percentage: function () {
            return this.selectedCategory.characters.indexOf(this.selectedCharacter) / (this.selectedCategory.characters.length - 1) * 100;
        }
    },

    methods: {
        goToCourseList: function () {
            this.page = 'course';
        },
        goToLearning: function (character, category) {
            this.selectedCharacter = character;
            this.selectedCategory = category;
            this.page = 'learning';
        },
        goToPractice: function (category) {
            this.selectedCategory = category;
            this.selectedCharacter = category.characters[Math.floor(Math.random() * category.characters.length)];
            this.page = 'practice';
            this.score = 0;
        },
        setRandomCharacter: function () {
            this.answer.translation = '[ english ]';
            this.answer.pinyin = 'pinyin';
            this.selectedCharacter = this.selectedCategory.characters[Math.floor(Math.random() * this.selectedCategory.characters.length)];
        },
        previous: function () {
            this.selectedCharacter = this.selectedCategory.characters[this.selectedCategory.characters.indexOf(this.selectedCharacter) - 1];
            this.updateProgressbar();
        },
        next: function () {
            this.selectedCharacter = this.selectedCategory.characters[this.selectedCategory.characters.indexOf(this.selectedCharacter) + 1];
            this.updateProgressbar();
        },
        isNotFirst: function () {
            return !(this.selectedCategory.characters[0] == this.selectedCharacter);
        },
        isNotLast: function () {
            return !(this.selectedCategory.characters[this.selectedCategory.characters.length - 1] == this.selectedCharacter);
        },
        updateProgressbar: function () {
            document.getElementById('progressbar').style.width = this.percentage + '%';
        },
        evaluate: function (event) {
            var input = document.getElementById('answerbox').value;

            if (input == this.selectedCharacter.translation)
            {
                this.answer.translation = input;
                document.getElementById('answerbox').value = '';
            }
            if (input == this.selectedCharacter.pinyin)
            {
                this.answer.pinyin = input;
                document.getElementById('answerbox').value = '';
            }
            if (this.selectedCharacter.translation == this.answer.translation
                && this.selectedCharacter.pinyin == this.answer.pinyin)
            {
                this.score++;

                swal({
                    title: "Good job",
                    text: "Your current score is: " + this.score,
                    type: "success",
                    confirmButtonText: "Give me another one!"
                }, this.setRandomCharacter());
            }
        }
    },

    ready: function () {
        this.$http.get('/chars.json').then(
            function (response) {
                this.$set('json', response.data);
                $('#preloader').delay(1000).fadeOut("slow");
            }
        );
    }
});