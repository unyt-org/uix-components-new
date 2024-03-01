
import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { Icon } from "./Icon.tsx";

type ImageCarouselEntryOptions = {
	image: string | URL,
	content?: Element,
	link?: string | URL,
	linkText?: string
}

type ImageCarouselOptions = {
	items: ImageCarouselEntryOptions[],
	size?: number,
	startIndex?: number
}
@template<ImageCarouselOptions>(({items, size}) =>
	<div class="image-carousel" style={`--size: ${size}`}>
		<nav>
			<span id="button-left"><Icon name="fa-chevron-left"/></span>
			<span id="button-right"><Icon name="fa-chevron-right"/></span>
		</nav>
		<div>
			<div id="carousel-slider">
				{
					...(items as unknown as ImageCarouselEntryOptions[]).map((item, index) => <a href={item.link} class="image-container">
						<img data-index={index} src={item.image}/>
						{item.content && <div class="content">item.content</div>}
						{item.linkText && <div class="link">{item.linkText} <Icon name="fa-chevron-right"/></div>}
					</a>)
				}
			</div>
		</div>
	</div>
)
export class ImageCarousel extends Component<ImageCarouselOptions> {
	private index = 0;
	@frontend @id("carousel-slider") carouselSlider!: HTMLDivElement;
	@frontend @id("button-left") buttonLeft!: HTMLDivElement;
	@frontend @id("button-right") buttonRight!: HTMLDivElement;

	@frontend offset = 0;
	@frontend isAnimating = false;

	@frontend startIndex = this.options.startIndex;

	@frontend
	private show(index: number, animation = true) {
		if (animation && this.isAnimating)
			return;
		if (index < 0) index = this.imageCount() - 1;
		else if (index >= this.imageCount()) index = 0;
		this.index = index;
		const image = this.getImage(index);
		const { x, width } = image.getBoundingClientRect();
		const offset = globalThis.innerWidth / 2 - x - width/2 - 5// grid gap ?
		this.querySelectorAll("img").forEach(image => image.parentElement!.removeAttribute("active"));
		image.setAttribute("active", "true");
		if (animation) {
			this.isAnimating = true;
			this.carouselSlider.classList.add("animated");
			setTimeout(()=>{
				this.isAnimating = false;
				this.carouselSlider.classList.remove("animated");
			}, 500)
		}
		this.setOffset(offset);
	}

	@frontend
	private setOffset(offset: number) {
		this.offset += offset;
		this.carouselSlider.style.transform = `translateX(${this.offset | 0}px)`;
	}

	@frontend
	private getImage(index: number) {
		return this.querySelector(`img[data-index='${index}']`)!.parentNode as unknown as HTMLImageElement;
	}
	@frontend
	private imageCount() {
		return this.querySelectorAll("img").length;
	}

	@frontend protected override onDisplay(): void | Promise<void> {
		globalThis.addEventListener("resize", () => {
			setTimeout(()=>this.show(this.index, false), 0);
		});
		this.buttonLeft.onclick = () => this.show(this.index - 1);
		this.buttonRight.onclick = () => this.show(this.index + 1);
		this.show(this.startIndex ?? Math.round((this.imageCount()-1)/2), false);
	}
}