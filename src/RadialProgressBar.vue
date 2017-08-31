<template>
	<div class="radial-progress-container" :style="containerStyle">
		<div class="radial-progress-inner" :style="innerCircleStyle">
			<slot></slot>
		</div>
		<svg class="radial-progress-bar" :width="diameter" :height="diameter" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<radialGradient id="radial-gradient"
					:fx="gradient.fx"
					:fy="gradient.fy"
					:cx="gradient.cx"
					:cy="gradient.cy"
					:r="gradient.r">
					<stop offset="0%" :stop-color="progressBarColor" stop-opacity="0"/>
					<stop offset="100%" :stop-color="progressBarColor" stop-opacity="1"/>
				</radialGradient>
			</defs>
			<!-- scale bar -->
			<path v-if="showScaleBar"
				id="scaleBar"
				:d="scaleBarPath"
				:stroke="scaleBarColor"
				fill="transparent"
				:style="scaleBarStyle"
				:stroke-dasharray="'1,'+(scaleBarLength-scaleBarSectionNumber-1)/scaleBarSectionNumber"/>

			<text v-if="showScaleBar"
				v-for="scaleText in scaleBarTextList"
				:dy="-1*scaleBarTextOffset"
				:text-anchor="scaleText.percentage==100 ? 'end' : 'start'"
				:style="'font-size: '+scaleBarTextFontSize+'px; fill: '+scaleBarTextColor">
				<textPath xlink:href="#scaleBar" startOffset="{{scaleText.percentage}}%">
					{{scaleText.text}}
				</textPath>
			</text>

			<path v-if="showScaleBar"
				:d="partialScaleBarPath"
				:stroke="'url(#radial-gradient)'"
				fill="transparent"
				:stroke-dasharray="'1,'+(scaleBarLength-scaleBarSectionNumber-1)/scaleBarSectionNumber"
				:style="partialScaleBarStyle"/>

			<path v-if="showScaleBar"
				:d="indicatorBarPath"
				:stroke="'url(#radial-gradient)'"
				fill="transparent"
				:stroke-dasharray="indicatorBarLength"
				:stroke-dashoffset="indicatorBarDashOffset"
				:style="indicatorBarStyle"/>

			<!-- background bar -->
			<path v-if="showBackgroundBar"
				v-for="backgroundBarPath in backgroundBarPathList"
				:id="'path'+backgroundBarPath.sequence"
				:d="backgroundBarPath.path"
				:stroke="backgroundBarPath.color"
				fill="transparent"
				:style="backgroundBarStyle"
				:stroke-linecap="backgroundBarPath.linecap"/>

			<text v-if="showBackgroundBar"
				v-for="backgroundBarPath in backgroundBarPathList"
				text-anchor="start"
				:dy="backgroundBarTextOffset"
				:style="'font-size: '+backgroundBarTextFontSize+'px; fill: '+backgroundBarTextColor">
				<textPath xlink:href="{{'#path'+backgroundBarPath.sequence}}">{{backgroundBarPath.floor}}</textPath>
			</text>

			<text v-if="showBackgroundBar"
				:dy="backgroundBarTextOffset"
				text-anchor="end"
				:style="'font-size: '+backgroundBarTextFontSize+'px; fill: '+backgroundBarTextColor">
				<textPath xlink:href="{{'#path'+backgroundBarPathList[0].sequence}}" startOffset="100%">
					{{backgroundBarPathList[0].ceiling}}
				</textPath>
			</text>

			<!-- background scale bar -->
			<path v-if="showBackgroundScaleBar"
				id="backgroundScaleBar"
				:d="backgroundScaleBarPath"
				:stroke="backgroundScaleBarColor"
				fill="transparent"
				:style="backgroundScaleBarStyle"
				:stroke-dasharray="'1,'+(backgroundScaleBarLength-backgroundBarScaleSectionNumber-1)/backgroundBarScaleSectionNumber"/>

			<text v-if="showBackgroundScaleBar"
				v-for="backgroundScaleBarText in backgroundScaleBarTextList"
				:dy="backgroundScaleBarTextOffset"
				:text-anchor="backgroundScaleBarText.percentage==100 ? 'end' : 'middle'"
				:style="'font-size: '+backgroundScaleBarTextFontSize+'px; fill: '+backgroundScaleBarTextColor">
				<textPath xlink:href="#backgroundScaleBar" startOffset="{{backgroundScaleBarText.percentage}}%">
					{{backgroundScaleBarText.text}}
				</textPath>
			</text>

			<!-- progress bar -->
			<path v-if="showProgressBar"
				:d="progressBarPath"
				:stroke="'url(#radial-gradient)'"
				fill="transparent"
				:stroke-dasharray="progressBarLength"
				:stroke-dashoffset="progressBarLength"
				:style="progressBarStyle"
				stroke-linecap="round"/>
		</svg>
	</div>
</template>

<script>
	export default {
		props: {
			diameter: {
				type: Number,
				required: false,
				default: 200
			},
			scaleBarWidth: {
				type: Number,
				required: false,
				default: 10
			},
			scaleBarOffset: {
				type: Number,
				required: false,
				default: 10
			},
			scaleBarColor: {
				type: String,
				required: false,
				default: 'black'
			},
			scaleBarSectionNumber: {
				type: Number,
				required: false,
				default: 100
			},
			scaleBarTextList: {
				type: Array,
				required: false,
				default: [
					{ percentage: 0, text: '0%' },
					{ percentage: 100, text: '100%' }
				]
			},
			scaleBarTextFontSize: {
				type: Number,
				required: false,
				default: 12
			},
			scaleBarTextColor: {
				type: String,
				required: false,
				default: 'red'
			},
			scaleBarTextOffset: {
				type: Number,
				required: false,
				default: 10
			},

			backgroundBarTextFontSize: {
				type: Number,
				required: false,
				default: 12
			},
			backgroundBarTextColor: {
				type: String,
				required: false,
				default: 'red'
			},

			backgroundScaleBarTextFontSize: {
				type: Number,
				required: false,
				default: 12
			},
			backgroundScaleBarTextColor: {
				type: String,
				required: false,
				default: 'red'
			},

			backgroundBarSectionList: {
				type: Array,
				required: false,
				default: [
					{ sequence: 1, floor: 0, ceiling: 20, percentage: 20/60, color: 'red', linecap: 'round' },
					{ sequence: 2, floor: 20, ceiling: 40, percentage: (40-20)/60, color: 'blue', linecap: 'butt' },
					{ sequence: 3, floor: 40, ceiling: 60, percentage: (60-40)/60, color: 'green', linecap: 'round' }
				]
			},
			backgroundBarTextOffset: {
				type: Number,
				required: false,
				default: 40
			},

			backgroundBarScaleSectionNumber: {
				type: Number,
				required: false,
				default: 10
			},
			backgroundScaleBarTextList: {
				type: Object,
				required: false,
				default: [
					{ percentage: 0, text: 0 },
					{ percentage: 10, text: 10 },
					{ percentage: 20, text: 20 },
					{ percentage: 30, text: 30 },
					{ percentage: 40, text: 40 },
					{ percentage: 50, text: 50 },
					{ percentage: 60, text: 60 },
					{ percentage: 70, text: 70 },
					{ percentage: 80, text: 80 },
					{ percentage: 90, text: 90 },
					{ percentage: 100, text: 100 }
				]
			},
			backgroundScaleBarTextOffset: {
				type: Number,
				required: false,
				default: 20
			},
			backgroundScaleBarColor: {
				type: String,
				required: false,
				default: 'white'
			},

			progressBarWidth: {
				type: Number,
				required: false,
				default: 15
			},
			progressBarColor: {
				type: String,
				required: false,
				default: 'red'
			},
			totalSteps: {
				type: Number,
				required: false,
				default: 100
			},
			completedSteps: {
				type: Number,
				required: false,
				default: 0
			},
			indicatorBarWidth: {
				type: Number,
				required: false,
				default: 15
			},
			backgroundScaleBarWidth: {
				type: Number,
				required: false,
				default: 10
			},
			halfBlankAngle: {
				type: Number,
				required: false,
				default: 30
			},
			showScaleBar: {
				type: Boolean,
				required: false,
				default: true
			},
			showBackgroundBar: {
				type: Boolean,
				required: false,
				default: true
			},
			showBackgroundScaleBar: {
				type: Boolean,
				required: false,
				default: true
			},
			showProgressBar: {
				type: Boolean,
				required: false,
				default: true
			}
		},

		data () {
			return {
				gradient: {
					fx: 0.5,
					fy: 0.5,
					cx: 0,
					cy: 0.5,
					r: 1
				},
				strokeDashoffset: 0,
				strokeDashoffset1: 0,
				backgroundBarPathList: []
			}
		},

		computed: {
			radius () {
				return this.diameter / 2
			},
			scaleBarInnerCircleDiameter () {
				return this.diameter - (this.scaleBarWidth * 2) - this.scaleBarTextOffset*2 - this.scaleBarTextFontSize*2
			},
			scaleBarInnerCircleRadius () {
				return this.scaleBarInnerCircleDiameter / 2
			},
			scaleBarLength () {
				return Math.PI * this.scaleBarInnerCircleDiameter * (1-this.halfBlankAngle/180);
			},
			progressBarInnerCircleDiameter () {
				return this.diameter - this.progressBarWidth*2
					- this.scaleBarOffset*2 - this.scaleBarWidth*2 - this.scaleBarTextOffset*2 - this.scaleBarTextFontSize*2
			},
			progressBarInnerCircleRadius () {
				return this.progressBarInnerCircleDiameter / 2
			},
			backgroundScaleBarInnerCircleDiameter () {
				return this.diameter - this.progressBarWidth*2
					- this.scaleBarOffset*2 - this.scaleBarWidth*2 - this.scaleBarTextOffset*2 - this.scaleBarTextFontSize*2
					- (this.progressBarWidth-this.backgroundScaleBarWidth)
			},
			backgroundScaleBarInnerCircleRadius () {
				return this.backgroundScaleBarInnerCircleDiameter / 2
			},
			progressBarLength () {
				return Math.PI * this.progressBarInnerCircleDiameter * (1-this.halfBlankAngle/180);
			},
			backgroundScaleBarLength () {
				return Math.PI * this.backgroundScaleBarInnerCircleDiameter * (1-this.halfBlankAngle/180);
			},
			indicatorBarLength () {
				return Math.PI * (this.scaleBarInnerCircleDiameter+5) * (1-this.halfBlankAngle/180)*this.finishedPercentage/100;
			},
			indicatorBarDashOffset () {
				return -1*Math.PI * (this.scaleBarInnerCircleDiameter+5) * (1-this.halfBlankAngle/180)*this.finishedPercentage/100+1;
			},
			finishedPercentage () {
				if (this.totalSteps === 0) {
					return 0
				}

				return this.completedSteps / this.totalSteps * 100;
			},
			containerStyle () {
				return {
					height: `${this.diameter}px`,
					width: `${this.diameter}px`
				}
			},
			progressBarStyle () {
				return {
					height: `${this.diameter}px`,
					width: `${this.diameter}px`,
					strokeWidth: `${this.progressBarWidth}px`,
					strokeDashoffset: this.strokeDashoffset
				}
			},
			partialScaleBarStyle () {
				return {
					height: `${this.diameter}px`,
					width: `${this.diameter}px`,
					strokeWidth: `${this.scaleBarWidth}px`
				}
			},
			indicatorBarStyle () {
				return {
					height: `${this.diameter}px`,
					width: `${this.diameter}px`,
					strokeWidth: `${this.indicatorBarWidth}px`
				}
			},
			scaleBarStyle () {
				return {
					height: `${this.diameter}px`,
					width: `${this.diameter}px`,
					strokeWidth: `${this.scaleBarWidth}px`
				}
			},
			backgroundBarStyle () {
				return {
					height: `${this.diameter}px`,
					width: `${this.diameter}px`,
					strokeWidth: `${this.progressBarWidth}px`,
					strokeDashoffset: 0
				}
			},
			backgroundScaleBarStyle () {
				return {
					height: `${this.diameter}px`,
					width: `${this.diameter}px`,
					strokeWidth: `${this.backgroundScaleBarWidth}px`,
					strokeDashoffset: 0
				}
			},
			innerCircleStyle () {
				return {
					width: `${this.progressBarInnerCircleDiameter}px`
				}
			},
			progressBarPath () {
				return 'M'+(this.radius-this.progressBarInnerCircleRadius * Math.sin(Math.PI/180*this.halfBlankAngle))
					+' '+(this.radius+this.progressBarInnerCircleRadius * Math.cos(Math.PI/180*this.halfBlankAngle))
					+' A '+this.progressBarInnerCircleRadius+' '+this.progressBarInnerCircleRadius+' 0 1 1 '
					+(this.radius+this.progressBarInnerCircleRadius * Math.sin(Math.PI/180*this.halfBlankAngle))
					+' '+(this.radius+this.progressBarInnerCircleRadius * Math.cos(Math.PI/180*this.halfBlankAngle));
			},
			scaleBarPath () {
				return 'M'+(this.radius-this.scaleBarInnerCircleRadius * Math.sin(Math.PI/180*this.halfBlankAngle))
					+' '+(this.radius+this.scaleBarInnerCircleRadius * Math.cos(Math.PI/180*this.halfBlankAngle))
					+' A '+this.scaleBarInnerCircleRadius+' '+this.scaleBarInnerCircleRadius+' 0 1 1 '
					+(this.radius+this.scaleBarInnerCircleRadius * Math.sin(Math.PI/180*this.halfBlankAngle))
					+' '+(this.radius+this.scaleBarInnerCircleRadius * Math.cos(Math.PI/180*this.halfBlankAngle));
			},
			partialScaleBarPath () {
				var endX = this.radius-this.scaleBarInnerCircleRadius * Math.sin(2*Math.PI*(1-this.halfBlankAngle/180)*this.finishedPercentage/100+this.halfBlankAngle/180*Math.PI);
				var endY = this.radius+this.scaleBarInnerCircleRadius * Math.cos(2*Math.PI*(1-this.halfBlankAngle/180)*this.finishedPercentage/100+this.halfBlankAngle/180*Math.PI);

				return 'M'+(this.radius-this.scaleBarInnerCircleRadius * Math.sin(Math.PI/180*this.halfBlankAngle))
					+' '+(this.radius+this.scaleBarInnerCircleRadius * Math.cos(Math.PI/180*this.halfBlankAngle))
					+' A '+this.scaleBarInnerCircleRadius+' '+this.scaleBarInnerCircleRadius
					+(this.finishedPercentage/100*(1-this.halfBlankAngle/180)>0.5 ? ' 0 1 1 ' : ' 0 0 1 ')
					+ endX+' '+endY;
			},
			indicatorBarPath () {
				var endX = this.radius-(this.scaleBarInnerCircleRadius+(this.indicatorBarWidth-this.scaleBarWidth)/2) * Math.sin(2*Math.PI*(1-this.halfBlankAngle/180)*this.finishedPercentage/100+this.halfBlankAngle/180*Math.PI);
				var endY = this.radius+(this.scaleBarInnerCircleRadius+(this.indicatorBarWidth-this.scaleBarWidth)/2) * Math.cos(2*Math.PI*(1-this.halfBlankAngle/180)*this.finishedPercentage/100+this.halfBlankAngle/180*Math.PI);

				return 'M'+(this.radius-(this.scaleBarInnerCircleRadius+(this.indicatorBarWidth-this.scaleBarWidth)/2) * Math.sin(Math.PI/180*this.halfBlankAngle))
					+' '+(this.radius+(this.scaleBarInnerCircleRadius+(this.indicatorBarWidth-this.scaleBarWidth)/2) * Math.cos(Math.PI/180*this.halfBlankAngle))
					+' A '+(this.scaleBarInnerCircleRadius+(this.indicatorBarWidth-this.scaleBarWidth)/2)+' '+(this.scaleBarInnerCircleRadius+(this.indicatorBarWidth-this.scaleBarWidth)/2)
					+(this.finishedPercentage/100*(1-this.halfBlankAngle/180)>0.5 ? ' 0 1 1 ' : ' 0 0 1 ')
					+ endX+' '+endY;
			},
			backgroundScaleBarPath () {
				return 'M'+(this.radius-this.backgroundScaleBarInnerCircleRadius * Math.sin(Math.PI/180*this.halfBlankAngle))
					+' '+(this.radius+this.backgroundScaleBarInnerCircleRadius * Math.cos(Math.PI/180*this.halfBlankAngle))
					+' A '+this.backgroundScaleBarInnerCircleRadius+' '+this.backgroundScaleBarInnerCircleRadius+' 0 1 1 '
					+(this.radius+this.backgroundScaleBarInnerCircleRadius * Math.sin(Math.PI/180*this.halfBlankAngle))
					+' '+(this.radius+this.backgroundScaleBarInnerCircleRadius * Math.cos(Math.PI/180*this.halfBlankAngle));
			}
		},
		methods: {
			changeProgress () {
				this.strokeDashoffset = this.progressBarLength - this.finishedPercentage/100 * this.progressBarLength
				this.strokeDashoffset1 = this.scaleBarLength - this.finishedPercentage/100 * this.scaleBarLength
			},
			getBackgroundBarPathList () {
				for (var i=0; i<this.backgroundBarSectionList.length; i++) {
					var lastPercentage = 0;
					var percentage = 0;

					for (var j=0; j<=i; j++) {
						if (j<i) {
							lastPercentage += this.backgroundBarSectionList[j].percentage;
						}

						percentage += this.backgroundBarSectionList[j].percentage;
					}

					var startX = this.radius-this.progressBarInnerCircleRadius * Math.sin(2*Math.PI*(1-this.halfBlankAngle/180)*lastPercentage+this.halfBlankAngle/180*Math.PI);
					var startY = this.radius+this.progressBarInnerCircleRadius * Math.cos(2*Math.PI*(1-this.halfBlankAngle/180)*lastPercentage+this.halfBlankAngle/180*Math.PI);

					var endX = this.radius-this.progressBarInnerCircleRadius * Math.sin(2*Math.PI*(1-this.halfBlankAngle/180)*percentage+this.halfBlankAngle/180*Math.PI);
					var endY = this.radius+this.progressBarInnerCircleRadius * Math.cos(2*Math.PI*(1-this.halfBlankAngle/180)*percentage+this.halfBlankAngle/180*Math.PI)

					var index = (i===this.backgroundBarSectionList.length-1) ? 0 : i+1;
					this.backgroundBarPathList[index] = {
						path: 'M'+startX+' '+startY+' A '+this.progressBarInnerCircleRadius+' '+this.progressBarInnerCircleRadius
							+(this.backgroundBarSectionList[i].percentage*(1-this.halfBlankAngle/180)>0.5 ? ' 0 1 1 ' : ' 0 0 1 ')
							+endX+' '+endY,
						color: this.backgroundBarSectionList[i].color,
						linecap: this.backgroundBarSectionList[i].linecap,
						startX: startX,
						startY: startY,
						endX: endX,
						endY: endY,
						floor: this.backgroundBarSectionList[i].floor,
						ceiling: this.backgroundBarSectionList[i].ceiling,
						sequence: this.backgroundBarSectionList[i].sequence
					};
				}
			}
		},

		watch: {
			completedSteps () {
				this.changeProgress({ isAnimate: true })
			},
			diameter () {
				this.changeProgress({ isAnimate: true })
			}
		},
		created () {
			this.getBackgroundBarPathList();
			this.changeProgress({ isAnimate: false })
		}
	}
</script>

<style>
	.radial-progress-container {
		position: relative;
	}

	.radial-progress-inner {
		position: absolute;
		top: 0; right: 0; bottom: 0; left: 0;
		position: absolute;
		border-radius: 50%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
