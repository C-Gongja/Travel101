export const DotsSpinner = () => (
	<div className="flex space-x-3">
		{[0, 1, 2].map((i) => (
			<span
				key={i}
				className="w-3 h-3 bg-maincolor rounded-full animate-pulseSpinner"
				style={{ animationDelay: `${i * 0.2}s` }}
			/>
		))}
	</div>
);